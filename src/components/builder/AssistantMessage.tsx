import { useState } from "react";
import {
  FileCode2,
  FilePlus2,
  FilePen,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  DollarSign,
  ListChecks,
  Terminal,
  Plug,
  Sparkles,
  X,
  StickyNote,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

/**
 * Chunk types — the assistant talks AND emits little semantic boxes.
 *
 * Supported markers (all parsed inline, in stream order):
 *   --- FILE: path ---           → "Creating <path>" box
 *   --- EDIT FILE: path ---      → "Edited <path>" small box
 *   [[PLAN: Title | step | step | step]]
 *   [[INTEGRATION: name]]        → "Loaded ai-<name> skill"
 *   [[RUN: command]]             → "Ran <command>"
 *   [[ARTIFACT: App Name]]       → "Set up the app <name>" artifact
 *   [[REDTOWN]]                  → "Made by Redtown 2" badge (dismissible)
 *   [[NOTE: text]]               → redtown.md note line
 */
type Chunk =
  | { kind: "prose"; text: string }
  | { kind: "file"; name: string; edit?: boolean }
  | { kind: "plan"; title: string; steps: string[] }
  | { kind: "integration"; name: string }
  | { kind: "run"; cmd: string }
  | { kind: "artifact"; name: string }
  | { kind: "redtown" }
  | { kind: "note"; text: string };

const MARKER_RE =
  /(?:---\s*(EDIT\s+)?FILE:\s*([^\n-]+?)\s*---)|(?:\[\[PLAN:\s*([^\]]+?)\]\])|(?:\[\[INTEGRATION:\s*([^\]]+?)\]\])|(?:\[\[RUN:\s*([^\]]+?)\]\])|(?:\[\[ARTIFACT:\s*([^\]]+?)\]\])|(?:\[\[REDTOWN\]\])|(?:\[\[NOTE:\s*([^\]]+?)\]\])/g;

function splitContent(content: string): Chunk[] {
  const chunks: Chunk[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(MARKER_RE.source, "g");

  while ((m = re.exec(content)) !== null) {
    if (m.index > lastIndex) {
      const text = content.slice(lastIndex, m.index).trim();
      if (text) chunks.push({ kind: "prose", text });
    }

    if (m[2]) {
      // FILE / EDIT FILE
      chunks.push({ kind: "file", name: m[2].trim(), edit: !!m[1] });
    } else if (m[3]) {
      const parts = m[3].split("|").map((p) => p.trim()).filter(Boolean);
      const [title, ...steps] = parts;
      chunks.push({ kind: "plan", title: title || "Plan", steps });
    } else if (m[4]) {
      chunks.push({ kind: "integration", name: m[4].trim() });
    } else if (m[5]) {
      chunks.push({ kind: "run", cmd: m[5].trim() });
    } else if (m[6]) {
      chunks.push({ kind: "artifact", name: m[6].trim() });
    } else if (m[7]) {
      chunks.push({ kind: "note", text: m[7].trim() });
    } else {
      chunks.push({ kind: "redtown" });
    }
    lastIndex = re.lastIndex;

    // Skip the file body until the next marker so raw code doesn't render in chat
    if (m[2]) {
      const tail = content.slice(re.lastIndex);
      const nextMarker = new RegExp(MARKER_RE.source, "g");
      nextMarker.lastIndex = 0;
      const nm = nextMarker.exec(tail);
      const skipTo = nm ? re.lastIndex + nm.index : content.length;
      lastIndex = skipTo;
      re.lastIndex = skipTo;
    }
  }

  if (lastIndex < content.length) {
    const tail = content.slice(lastIndex).trim();
    if (tail) chunks.push({ kind: "prose", text: tail });
  }

  if (chunks.length === 0) chunks.push({ kind: "prose", text: content });
  return chunks;
}

const PROSE_CLASSES =
  "prose prose-sm max-w-none [&>*]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_code]:bg-secondary [&_code]:text-primary [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-secondary/80 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_a]:text-primary";

interface Props {
  content: string;
  isComplete?: boolean;
  onRestart?: () => void;
}

export default function AssistantMessage({ content, isComplete, onRestart }: Props) {
  const chunks = splitContent(content);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);
  const [redtownDismissed, setRedtownDismissed] = useState(false);
  const [redtownInfo, setRedtownInfo] = useState(false);

  const tokens = Math.ceil(content.length / 4);
  const moneyLost = (tokens / 1000) * 0.03;

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <div className="space-y-2">
      {chunks.map((c, i) => {
        if (c.kind === "prose") {
          return (
            <div key={i} className={PROSE_CLASSES}>
              <ReactMarkdown>{c.text}</ReactMarkdown>
            </div>
          );
        }

        if (c.kind === "file") {
          return (
            <div
              key={i}
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium mr-1.5 ${
                c.edit
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-primary/30 bg-primary/10 text-primary"
              }`}
            >
              {c.edit ? <FilePen className="h-3.5 w-3.5" /> : <FilePlus2 className="h-3.5 w-3.5" />}
              <span className="font-mono">
                {c.edit ? "Edited" : "Creating"} {c.name}
              </span>
            </div>
          );
        }

        if (c.kind === "plan") {
          return (
            <div
              key={i}
              className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-3 my-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Planning: {c.title}
                </span>
              </div>
              <ul className="space-y-1">
                {c.steps.map((s, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="text-primary font-mono">{j + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (c.kind === "integration") {
          return (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mr-1.5"
            >
              <Plug className="h-3.5 w-3.5" />
              <span className="font-mono">Loaded ai-{c.name} skill</span>
            </div>
          );
        }

        if (c.kind === "run") {
          return (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono mr-1.5"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Ran {c.cmd}</span>
            </div>
          );
        }

        if (c.kind === "artifact") {
          return (
            <div
              key={i}
              className="rounded-lg border border-primary/40 bg-card p-3 my-2 flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-md bg-primary/15 grid place-items-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Artifact
                </div>
                <div className="text-sm font-semibold text-foreground truncate">
                  Set up the app — {c.name}
                </div>
              </div>
            </div>
          );
        }

        if (c.kind === "note") {
          return (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-muted-foreground border-l-2 border-primary/40 pl-2 my-1"
            >
              <StickyNote className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span className="font-mono">redtown.md → {c.text}</span>
            </div>
          );
        }

        // redtown badge
        if (redtownDismissed) return null;
        return (
          <div
            key={i}
            className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold mr-1.5"
          >
            <button
              className="text-left"
              onClick={() => setRedtownInfo((v) => !v)}
              title="What is .redtown?"
            >
              .redtown — Made by Redtown 2
            </button>
            <button
              onClick={() => setRedtownDismissed(true)}
              title="Remove .redtown badge"
              className="ml-1 h-4 w-4 inline-flex items-center justify-center rounded hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </button>
            {redtownInfo && (
              <div className="absolute top-full left-0 mt-1 z-10 w-64 p-2 rounded-md border border-border bg-card text-foreground text-[11px] font-normal shadow-lg">
                This file was created by <strong>Redtown 2</strong>. Click the
                X to remove the badge from your project.
              </div>
            )}
          </div>
        );
      })}

      {isComplete && content.trim().length > 0 && (
        <div className="mt-3 pt-2 border-t border-border/60 flex items-center gap-1 flex-wrap">
          {onRestart && (
            <button
              onClick={onRestart}
              title="Restart / regenerate"
              className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setFeedback(feedback === "up" ? null : "up")}
            title="Good response"
            className={`h-7 w-7 inline-flex items-center justify-center rounded-md transition-colors ${
              feedback === "up"
                ? "text-primary bg-primary/15"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setFeedback(feedback === "down" ? null : "down")}
            title="Bad response"
            className={`h-7 w-7 inline-flex items-center justify-center rounded-md transition-colors ${
              feedback === "down"
                ? "text-destructive bg-destructive/15"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={copyAll}
            title="Copy message"
            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <div
            title={`~${tokens.toLocaleString()} tokens spent on this response`}
            className="ml-auto inline-flex items-center gap-1 px-2 h-7 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-mono"
          >
            <DollarSign className="h-3 w-3" />
            <span>-${moneyLost.toFixed(4)} lost</span>
          </div>
        </div>
      )}
    </div>
  );
}
