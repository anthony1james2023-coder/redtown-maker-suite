import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReplitLogo from "@/components/ReplitLogo";
import {
  buildPreview,
  fileLanguage,
  type ReplFiles,
} from "@/lib/replTemplates";
import {
  Play,
  Loader2,
  ChevronLeft,
  Check,
  FileCode,
  Plus,
  X,
  Trash2,
  Eye,
  TerminalSquare,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface ConsoleLine {
  type: "log" | "error" | "warn";
  text: string;
}

const langExtension = (filename: string) => {
  const l = fileLanguage(filename);
  if (l === "css") return [css()];
  if (l === "javascript") return [javascript()];
  return [html()];
};

const Repl = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [files, setFiles] = useState<ReplFiles>({});
  const [activeFile, setActiveFile] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [previewDoc, setPreviewDoc] = useState("");
  const [tab, setTab] = useState<"preview" | "console">("preview");
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Load repl
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from("projects")
      .select("name, files, user_id")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Repl not found");
          navigate("/~");
          return;
        }
        if (data.user_id && user && data.user_id !== user.id) {
          toast.error("You don't have access to this Repl");
          navigate("/~");
          return;
        }
        const f = (data.files as ReplFiles) || {};
        const filenames = Object.keys(f);
        setName(data.name);
        setFiles(f);
        setActiveFile(filenames.includes("index.html") ? "index.html" : filenames[0] || "");
        setLoading(false);
        setPreviewDoc(buildPreview(f));
      });
  }, [id, navigate, user]);

  // Capture console messages from the preview iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.__replConsole) {
        setConsoleLines((prev) => [
          ...prev,
          { type: e.data.level, text: e.data.text },
        ]);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const save = useCallback(
    async (filesToSave: ReplFiles, silent = false) => {
      if (!id) return;
      setSaving(true);
      const { error } = await supabase
        .from("projects")
        .update({ files: filesToSave })
        .eq("id", id);
      setSaving(false);
      if (error) {
        if (!silent) toast.error("Failed to save");
      } else {
        setDirty(false);
      }
    },
    [id]
  );

  const handleChange = (value: string) => {
    setFiles((prev) => {
      const updated = { ...prev, [activeFile]: value };
      setDirty(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => save(updated, true), 1200);
      return updated;
    });
  };

  const run = useCallback(() => {
    setConsoleLines([]);
    const doc = buildPreview(files);
    const instrumented = doc.replace(
      "</head>",
      `<script>
        (function(){
          var send=function(level,args){
            try{parent.postMessage({__replConsole:true,level:level,text:Array.from(args).map(function(a){
              try{return typeof a==='object'?JSON.stringify(a):String(a)}catch(e){return String(a)}
            }).join(' ')},'*')}catch(e){}
          };
          ['log','warn','error'].forEach(function(m){
            var o=console[m].bind(console);
            console[m]=function(){send(m,arguments);o.apply(console,arguments)};
          });
          window.addEventListener('error',function(e){send('error',[e.message])});
        })();
      </script></head>`
    );
    setPreviewDoc(instrumented.includes("</head>") ? instrumented : doc);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    save(files, true);
  }, [files, save]);

  // Run on first load
  useEffect(() => {
    if (!loading && Object.keys(files).length) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const addFile = () => {
    const fn = newFileName.trim();
    if (!fn) return;
    if (files[fn]) {
      toast.error("A file with that name already exists");
      return;
    }
    const updated = { ...files, [fn]: "" };
    setFiles(updated);
    setActiveFile(fn);
    setNewFileName("");
    setNewFileOpen(false);
    save(updated, true);
  };

  const deleteFile = (fn: string) => {
    if (Object.keys(files).length <= 1) {
      toast.error("A Repl needs at least one file");
      return;
    }
    const updated = { ...files };
    delete updated[fn];
    setFiles(updated);
    if (activeFile === fn) setActiveFile(Object.keys(updated)[0]);
    save(updated, true);
  };

  const filenames = useMemo(() => Object.keys(files), [files]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="h-12 shrink-0 border-b border-border flex items-center justify-between px-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/~")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Link to="/" className="hidden sm:block">
            <ReplitLogo showText={false} />
          </Link>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => id && supabase.from("projects").update({ name }).eq("id", id)}
            className="h-8 w-44 sm:w-64 bg-transparent border-transparent hover:border-border focus:border-border font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </>
            ) : dirty ? (
              "Unsaved"
            ) : (
              <>
                <Check className="h-3 w-3 text-terminal-green" /> Saved
              </>
            )}
          </span>
          <Button size="sm" className="gap-1.5 bg-terminal-green hover:bg-terminal-green/90 text-black" onClick={run}>
            <Play className="h-4 w-4 fill-current" /> Run
          </Button>
        </div>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* File sidebar */}
        <ResizablePanel defaultSize={16} minSize={12} maxSize={28} className="bg-card">
          <div className="h-9 flex items-center justify-between px-3 border-b border-border">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Files
            </span>
            <button
              onClick={() => setNewFileOpen(true)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="New file"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {newFileOpen && (
            <div className="p-2 flex gap-1">
              <Input
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addFile();
                  if (e.key === "Escape") setNewFileOpen(false);
                }}
                placeholder="file.js"
                className="h-7 text-xs"
              />
            </div>
          )}
          <div className="py-1">
            {filenames.map((fn) => (
              <div
                key={fn}
                onClick={() => setActiveFile(fn)}
                className={`group flex items-center justify-between px-3 py-1.5 text-sm cursor-pointer ${
                  activeFile === fn
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <FileCode className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{fn}</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(fn);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-destructive"
                  aria-label={`Delete ${fn}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Editor */}
        <ResizablePanel defaultSize={46} minSize={25}>
          <div className="h-9 flex items-center px-3 border-b border-border bg-card">
            <span className="text-xs font-mono text-muted-foreground">{activeFile}</span>
          </div>
          <div className="h-[calc(100%-2.25rem)] overflow-auto">
            {activeFile && (
              <CodeMirror
                value={files[activeFile] ?? ""}
                height="100%"
                theme={vscodeDark}
                extensions={langExtension(activeFile)}
                onChange={handleChange}
                className="text-sm h-full"
              />
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview / console */}
        <ResizablePanel defaultSize={38} minSize={20}>
          <div className="h-9 flex items-center justify-between px-2 border-b border-border bg-card">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs ${
                  tab === "preview"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button
                onClick={() => setTab("console")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs ${
                  tab === "console"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TerminalSquare className="h-3.5 w-3.5" /> Console
                {consoleLines.length > 0 && (
                  <span className="ml-0.5 text-[10px] bg-primary/20 text-primary rounded px-1">
                    {consoleLines.length}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={run}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="Refresh preview"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="h-[calc(100%-2.25rem)] bg-white">
            {tab === "preview" ? (
              <iframe
                title="Live preview"
                srcDoc={previewDoc}
                sandbox="allow-scripts allow-forms allow-modals allow-popups"
                className="w-full h-full border-0 bg-white"
              />
            ) : (
              <div className="h-full bg-[hsl(var(--code-bg))] text-foreground font-mono text-xs p-3 overflow-auto">
                {consoleLines.length === 0 ? (
                  <p className="text-muted-foreground">
                    Console output appears here when you Run.
                  </p>
                ) : (
                  consoleLines.map((l, i) => (
                    <div
                      key={i}
                      className={`py-0.5 border-b border-border/30 whitespace-pre-wrap ${
                        l.type === "error"
                          ? "text-destructive"
                          : l.type === "warn"
                          ? "text-brand-orange"
                          : "text-foreground"
                      }`}
                    >
                      {l.text}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Repl;
