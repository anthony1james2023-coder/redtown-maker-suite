import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import AssistantMessage from "@/components/builder/AssistantMessage";
import SlashMenu, { type SlashItem } from "@/components/builder/SlashMenu";
import PublishDialog from "@/components/builder/PublishDialog";
import {
  MessageSquarePlus,
  Plus,
  ArrowUpRight,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  MousePointerClick,
  History,
  Rocket,
  Paperclip,
} from "lucide-react";
import {
  extractArchive,
  readSingleFile,
  inlineImages,
  type ImportResult,
} from "@/lib/importFiles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LivePreviewPanel from "@/components/builder/LivePreviewPanel";
import VisualEditHistoryPanel, {
  type VisualEditEntry,
} from "@/components/builder/VisualEditHistoryPanel";
import { useSubscription, PlanType } from "@/hooks/useSubscription";
import { parseMultiFile } from "@/lib/parseMultiFile";
import { buildProjectContext } from "@/lib/projectContext";
import { diffFileSets } from "@/lib/lineDiff";

// An attachment lets the AI actually SEE the upload (images/videos) or READ
// large text/spec files — sent as OpenAI-style multimodal content parts.
type Attachment = {
  kind: "image" | "video" | "text";
  name: string;
  dataUrl?: string; // for image/video
  text?: string; // for text/spec files
};
type Msg = { role: "user" | "assistant"; content: string; attachments?: Attachment[] };

// Convert local messages into gateway multimodal format. Messages that carry
// attachments become an array of content parts so the model can see/read them.
function toApiMessages(msgs: Msg[]) {
  return msgs.map((m) => {
    if (m.role === "user" && m.attachments && m.attachments.length > 0) {
      const parts: Array<Record<string, unknown>> = [];
      if (m.content) parts.push({ type: "text", text: m.content });
      for (const a of m.attachments) {
        if ((a.kind === "image" || a.kind === "video") && a.dataUrl) {
          parts.push({ type: "image_url", image_url: { url: a.dataUrl } });
        } else if (a.kind === "text" && a.text) {
          parts.push({ type: "text", text: `📄 ${a.name}:\n${a.text}` });
        }
      }
      return { role: m.role, content: parts };
    }
    return { role: m.role, content: m.content };
  });
}

const SUGGESTIONS = [
  "Check my app for bugs",
  "Add payment processing",
  "Connect with an AI Assistant",
  "Add SMS message sending",
  "Add a database",
  "Add authenticated user login",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
  plan,
  currentProject,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
  plan: PlanType;
  currentProject?: string;
}) {
  // Require a signed-in user — no anonymous AI usage.
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    onError("Please sign in to use the AI builder.");
    return;
  }
  const token = session.access_token;
  
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages: toApiMessages(messages), plan, currentProject }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) {
    onError("No response stream");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx: number;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIdx);
      buffer = buffer.slice(newlineIdx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        onDone();
        return;
      }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

const BuilderAgent2 = () => {
  const { user } = useAuth();
  const { plan } = useSubscription();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamingContent, setStreamingContent] = useState("");
  // Persistent project files across turns — AI edits merge in, never reset.
  const [baseFiles, setBaseFiles] = useState<Record<string, string>>({});
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [editHistory, setEditHistory] = useState<VisualEditEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importedImages, setImportedImages] = useState<Record<string, string>>({});
  const [queued, setQueued] = useState(0);

  // Refs mirror state so queued/sequential turns always read fresh values
  // (closures inside async turns would otherwise go stale).
  const baseFilesRef = useRef<Record<string, string>>({});
  const messagesRef = useRef<Msg[]>([]);
  const queueRef = useRef<Array<{ text: string; attachments?: Attachment[]; visual: boolean }>>([]);
  const processingRef = useRef(false);
  useEffect(() => { baseFilesRef.current = baseFiles; }, [baseFiles]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const BIG_PROMPT = 6000; // prompts longer than this get organized into a file

  // Serialize a file map back into --- FILE: --- format for the preview parser
  const serializeFiles = (files: Record<string, string>) =>
    Object.entries(files)
      .map(([path, content]) => `--- FILE: ${path} ---\n${content}`)
      .join("\n\n");

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ♾️ INFINITE CONVERSATION — the AI never stops. Type a second (or tenth)
  // prompt while it's still building and it's queued, then runs automatically.
  const sendMessage = (rawText: string, attachments?: Attachment[]) => {
    const text = rawText.trim();
    if (!text && !(attachments && attachments.length)) return;
    queueRef.current.push({ text, attachments, visual: visualEditMode });
    setQueued(queueRef.current.length);
    setInput("");
    void drainQueue();
  };

  const drainQueue = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsLoading(true);
    while (queueRef.current.length > 0) {
      const next = queueRef.current.shift()!;
      setQueued(queueRef.current.length);
      try {
        await runMessage(next.text, next.attachments, next.visual);
      } catch {
        toast.error("Failed to connect to AI");
      }
    }
    processingRef.current = false;
    setIsLoading(false);
  };

  const runMessage = (
    text: string,
    attachments: Attachment[] | undefined,
    visual: boolean,
  ) =>
    new Promise<void>((resolve) => {
      let content = visual
        ? `🎨 VISUAL EDIT MODE: Make the following targeted visual change to the existing preview WITHOUT changing any other code, layout, or functionality. Only adjust styles/text/colors/fonts as requested. Re-emit ALL existing files unchanged except for the minimal CSS/HTML edit needed.\n\nRequest: ${text}`
        : text;
      const atts: Attachment[] = attachments ? [...attachments] : [];

      // 📚 BIG PROMPT → organized into a file. Long requests are saved as a
      // spec file in the project and attached so the AI reads the full text.
      if (text.length > BIG_PROMPT) {
        const specName = `prompts/prompt-${Date.now()}.md`;
        const merged = { ...baseFilesRef.current, [specName]: text };
        baseFilesRef.current = merged;
        setBaseFiles(merged);
        setStreamingContent(serializeFiles(merged));
        atts.push({ kind: "text", name: specName, text });
        content =
          (visual ? "🎨 VISUAL EDIT MODE — " : "") +
          `📝 My request was large, so I organized it into **${specName}**. The full spec is attached below — read it fully and build accordingly.`;
      }

      const userMsg: Msg = {
        role: "user",
        content,
        attachments: atts.length ? atts : undefined,
      };
      const allMessages = [...messagesRef.current, userMsg];
      messagesRef.current = allMessages;
      setMessages(allMessages);

      let assistantSoFar = "";

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        // Live-merge: base project + whatever the AI has streamed so far.
        const streamingParsed = parseMultiFile(assistantSoFar);
        const merged: Record<string, string> = { ...baseFilesRef.current };
        for (const f of streamingParsed) merged[f.path] = f.content;
        setStreamingContent(serializeFiles(merged));
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            const copy = prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
            );
            messagesRef.current = copy;
            return copy;
          }
          const copy = [...prev, { role: "assistant" as const, content: assistantSoFar }];
          messagesRef.current = copy;
          return copy;
        });
      };

      // Build a SCOPED project context so the AI EDITS instead of resetting.
      const projectFiles = Object.entries(baseFilesRef.current).map(([path, c]) => {
        const filename = path.split("/").pop() || path;
        const folder = path.includes("/") ? path.split("/").slice(0, -1).join("/") : "";
        const ext = filename.split(".").pop()?.toLowerCase() || "";
        const langMap: Record<string, string> = { html: "html", css: "css", js: "javascript", ts: "typescript", json: "json" };
        return { path, filename, folder, content: c, language: langMap[ext] || "text" };
      });
      const currentProject = projectFiles.length > 0
        ? buildProjectContext({ userMessage: text, files: projectFiles, visualEditMode: visual })
        : undefined;

      const beforeFiles = projectFiles.map((f) => ({ path: f.path, content: f.content }));
      const editPrompt = text.trim();

      streamChat({
        messages: allMessages,
        plan,
        currentProject,
        onDelta: upsertAssistant,
        onDone: () => {
          const afterParsed = parseMultiFile(assistantSoFar);
          const merged: Record<string, string> = { ...baseFilesRef.current };
          for (const f of afterParsed) merged[f.path] = f.content;
          baseFilesRef.current = merged;
          setBaseFiles(merged);
          setStreamingContent(serializeFiles(merged));
          if (visual) {
            const afterFiles = Object.entries(merged).map(([path, c]) => ({ path, content: c }));
            const diffs = diffFileSets(beforeFiles, afterFiles);
            setEditHistory((prev) => [
              { id: crypto.randomUUID(), timestamp: Date.now(), prompt: editPrompt, diffs },
              ...prev,
            ]);
          }
          resolve();
        },
        onError: (err) => {
          toast.error(err);
          resolve();
        },
      }).catch(() => resolve());
    });


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // 📦 Upload files / images / zip / apk and recreate them into the project.
  // The preview is preserved — imported files MERGE into the current project
  // and immediately appear in the live preview + Files panel.
  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || importing) return;
    setImporting(true);
    try {
      const all: ImportResult[] = [];
      for (const file of Array.from(fileList)) {
        const name = file.name.toLowerCase();
        if (name.endsWith(".zip") || name.endsWith(".apk")) {
          toast.message(`Unpacking ${file.name}…`);
          all.push(await extractArchive(file));
        } else {
          all.push(await readSingleFile(file));
        }
      }

      // Merge everything into one map.
      const newFiles: Record<string, string> = {};
      const newImages: Record<string, string> = {};
      const newVideos: Record<string, string> = {};
      const newModels: Record<string, string> = {};
      const skipped: string[] = [];
      for (const r of all) {
        Object.assign(newFiles, r.files);
        Object.assign(newImages, r.images);
        Object.assign(newVideos, r.videos);
        Object.assign(newModels, r.models);
        skipped.push(...r.skipped);
      }

      const fileCount = Object.keys(newFiles).length;
      const imgCount = Object.keys(newImages).length;
      const vidCount = Object.keys(newVideos).length;
      const modelCount = Object.keys(newModels).length;
      if (fileCount === 0 && imgCount === 0 && vidCount === 0 && modelCount === 0) {
        toast.error("Nothing readable found in that upload.");
        return;
      }

      // Persist into the project + inline images/models so the preview renders them.
      const mergedImages = { ...importedImages, ...newImages };
      setImportedImages(mergedImages);
      // Inline both images and 3D model data URLs (Three.js loaders accept data: URLs).
      const mergedFiles = inlineImages(
        { ...baseFilesRef.current, ...newFiles },
        { ...mergedImages, ...newModels }
      );
      baseFilesRef.current = mergedFiles;
      setBaseFiles(mergedFiles);
      setStreamingContent(serializeFiles(mergedFiles));

      // 👁️ Build multimodal attachments so the AI can actually SEE the media
      // (images + videos) and READ big text files — not just be told about them.
      const withinSize = (dataUrl: string) => dataUrl.length * 0.75 < 8_000_000; // ~8MB cap
      const attachments: Attachment[] = [];
      for (const [name, dataUrl] of Object.entries(newImages)) {
        if (attachments.length < 16 && withinSize(dataUrl)) attachments.push({ kind: "image", name, dataUrl });
      }
      for (const [name, dataUrl] of Object.entries(newVideos)) {
        if (attachments.length < 20 && withinSize(dataUrl)) attachments.push({ kind: "video", name, dataUrl });
      }
      let textAtt = 0;
      for (const [name, content] of Object.entries(newFiles)) {
        if (textAtt >= 20) break;
        attachments.push({ kind: "text", name, text: content.slice(0, 100_000) });
        textAtt++;
      }

      // Tell the AI exactly what landed so it "understands the zip".
      const srcNames = all.map((r) => r.sourceName).join(", ");
      const isArchiveOrApp = all.some((r) => {
        const n = r.sourceName.toLowerCase();
        return n.endsWith(".zip") || n.endsWith(".apk") || n.endsWith(".html") || n.endsWith(".htm");
      });
      const allPaths = Object.keys(newFiles)
        .concat(Object.keys(newImages))
        .concat(Object.keys(newVideos))
        .concat(Object.keys(newModels))
        .sort();
      const shown = allPaths.slice(0, 400);
      const fileTree = shown.map((p) => `  - ${p}`).join("\n");
      const more = allPaths.length - shown.length;
      const totalBytes = Object.values(newFiles).reduce((n, c) => n + c.length, 0);
      const kb = Math.max(1, Math.round(totalBytes / 1024));
      const is3D =
        modelCount > 0 ||
        Object.keys(newFiles).some((p) =>
          /\.(glsl|vert|frag|hlsl|wgsl|gltf)$/i.test(p)
        ) ||
        Object.values(newFiles).some((c) =>
          /three\.|THREE\.|webgl|WebGLRenderer|eaglercraft|voxel|PointerLock/i.test(c)
        );

      // Full source of the extracted code files (so the AI reads every line,
      // not just the tree) — capped so we don't blow the request size.
      let sourceDump = "";
      let dumped = 0;
      for (const [name, content] of Object.entries(newFiles)) {
        if (sourceDump.length > 400_000) break;
        sourceDump += `\n\n===== FILE: ${name} =====\n${content.slice(0, 40_000)}`;
        dumped++;
      }

      const summary = isArchiveOrApp
        ? `📦 I extracted **${srcNames}** — a full app/archive. Recreate-the-project mode.\n\n` +
          `The archive unpacked to **${fileCount} code file${fileCount !== 1 ? "s" : ""}**` +
          (imgCount ? `, **${imgCount} image${imgCount !== 1 ? "s" : ""}**` : "") +
          (vidCount ? `, **${vidCount} video${vidCount !== 1 ? "s" : ""}**` : "") +
          (modelCount ? `, **${modelCount} 3D model/asset${modelCount !== 1 ? "s" : ""}**` : "") +
          ` (~${kb} KB of source, ${allPaths.length} total paths).\n\n` +
          (skipped.length ? `Skipped ${skipped.length} binary file(s).\n\n` : "") +
          (is3D ? "🧊 This looks like a **3D / WebGL project** — rebuild the scene, render loop, controls and shaders faithfully.\n\n" : "") +
          "Extracted file tree:\n" +
          fileTree +
          (more > 0 ? `\n  …and ${more} more` : "") +
          "\n\n**Environment available:** 128 GB storage · 64 vCPUs — you can index ~10,000 files in seconds and grep to find any code fast.\n\n" +
          "**Your task:** Index the tree, grep for the relevant symbols, read the files that matter, then:\n" +
          "1. Give a short **feasibility check** — can you recreate this project here? (yes / partly / no + why).\n" +
          "2. List the app's stack, structure and key features you detected.\n" +
          "3. Recreate it into the project so it runs in the live preview, keeping the same look and behaviour, and apply any requested changes fully across every file needed. Re-emit files with the FILE markers.\n\n" +
          "Full extracted source follows:\n" +
          sourceDump +
          (dumped < fileCount ? `\n\n…(${fileCount - dumped} more files in the project — grep/read those too)` : "")
        : `📦 I uploaded **${srcNames}** into the project.\n\n` +
          `Added **${fileCount} code file${fileCount !== 1 ? "s" : ""}**` +
          (imgCount ? `, **${imgCount} image${imgCount !== 1 ? "s" : ""}**` : "") +
          (vidCount ? `, **${vidCount} video${vidCount !== 1 ? "s" : ""}**` : "") +
          ` — they're now live in the preview and attached for you to see.\n\n` +
          (skipped.length ? `Skipped ${skipped.length} binary file(s).\n\n` : "") +
          "Project files now include:\n" +
          fileTree +
          (more > 0 ? `\n  …and ${more} more` : "") +
          "\n\nLook at the attached images/videos and read the files, then keep the same preview — you can edit, fix, or recreate any of these.";

      toast.success(
        `Imported ${fileCount + imgCount + vidCount} file${fileCount + imgCount + vidCount !== 1 ? "s" : ""} — AI is reviewing them`
      );
      // Send it through the AI so it truly sees/reads the upload.
      sendMessage(summary, attachments);

    } catch (e) {
      console.error(e);
      toast.error("Couldn't read that upload. Is the archive valid?");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const newChat = () => {
    queueRef.current = [];
    setQueued(0);
    messagesRef.current = [];
    baseFilesRef.current = {};
    setMessages([]);
    setInput("");
    setBaseFiles({});
    setStreamingContent("");
    setImportedImages({});
  };


  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* Chat Panel */}
      <div
        className={`flex flex-col border-r border-border transition-all duration-300 ${
          sidebarOpen ? "w-[420px] min-w-[340px]" : "w-0 min-w-0 overflow-hidden"
        }`}
      >
        {/* Chat Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={newChat}
              className="h-8 w-8"
              title="New chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">Agent 2</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              onClick={() => setPublishOpen(true)}
              className="h-8 gap-1.5 px-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-xs"
              title="Publish project"
            >
              <Rocket className="h-3.5 w-3.5" />
              Publish
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHistoryOpen(true)}
              className="h-8 w-8 relative"
              title="Visual edit history"
            >
              <History className="h-4 w-4" />
              {editHistory.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                  {editHistory.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="mb-6">
                <MessageSquarePlus className="h-16 w-16 text-muted-foreground/30 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                New chat with Agent
              </h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-[280px]">
                Agent can make changes, review its work, and debug itself automatically.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-[360px]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 text-xs rounded-full border border-border bg-card hover:bg-secondary text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <AssistantMessage
                        content={msg.content}
                        isComplete={!(isLoading && i === messages.length - 1)}
                        onRestart={() => {
                          // find preceding user message and resend it
                          const prevUser = [...messages.slice(0, i)].reverse().find((m) => m.role === "user");
                          if (prevUser) {
                            setMessages(messages.slice(0, i));
                            sendMessage(prevUser.content);
                          }
                        }}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-border shrink-0">
          {(isLoading || queued > 0) && (
            <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>
                AI never stops — keep typing.
                {queued > 0 && ` ${queued} message${queued !== 1 ? "s" : ""} queued.`}
              </span>
            </div>
          )}
          <div className="relative bg-card border border-border rounded-xl">
            {(() => {
              const trigger = input.match(/(^|\s)\/([\w-]*)$/);
              if (!trigger) return null;
              const q = trigger[2];
              return (
                <SlashMenu
                  query={q}
                  onPick={(item: SlashItem) => {
                    const replaced = input.replace(/(^|\s)\/([\w-]*)$/, `$1${item.insert}`);
                    setInput(replaced);
                    textareaRef.current?.focus();
                  }}
                />
              );
            })()}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={visualEditMode ? "Describe a visual edit (text, color, font)..." : "Make, test, iterate... (type / for connectors)"}
              className="min-h-[44px] max-h-[140px] resize-none border-0 bg-transparent pl-3 pr-12 pb-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <div className="absolute left-2 bottom-2 flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".zip,.apk,image/*,.html,.css,.js,.jsx,.ts,.tsx,.json,.md,.txt,.svg,.py,.csv,.xml,.yml,.yaml"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                title="Upload files, images, or a .zip / .apk — they're recreated into the project"
              >
                {importing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Paperclip className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">{importing ? "Importing…" : "Upload"}</span>
              </Button>
              <Button
                size="sm"
                variant={visualEditMode ? "default" : "ghost"}
                onClick={() => setVisualEditMode((v) => !v)}
                className={`h-7 gap-1.5 px-2 text-[11px] ${
                  visualEditMode
                    ? "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Visual Edits — make targeted style/text changes without touching the rest"
              >
                <MousePointerClick className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="h-7 w-7"
                title="Attach files / zip"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="h-7 w-7 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-30"
                title={isLoading ? "AI is building — your message will be queued and run next" : "Send"}
              >
                <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col relative">
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="absolute top-3 left-3 z-10 h-8 w-8"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        )}
        <LivePreviewPanel streamingContent={streamingContent} isStreaming={isLoading} />
      </div>

      <VisualEditHistoryPanel
        entries={editHistory}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  );
};

export default BuilderAgent2;
