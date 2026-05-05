import { useState } from "react";
import { FileCode2, RotateCw, ThumbsUp, ThumbsDown, Copy, Check, DollarSign } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

/**
 * Splits an assistant message into prose chunks and "file pill" chunks.
 */
type Chunk =
  | { kind: "prose"; text: string }
  | { kind: "file"; name: string };

function splitContent(content: string): Chunk[] {
  const re = /---\s*FILE:\s*([^\s-][^\n-]*?)\s*---/g;
  const chunks: Chunk[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const matches: { index: number; end: number; name: string }[] = [];

  while ((match = re.exec(content)) !== null) {
    matches.push({ index: match.index, end: re.lastIndex, name: match[1].trim() });
  }

  if (matches.length === 0) {
    return [{ kind: "prose", text: content }];
  }

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const proseEnd = m.index;
    if (proseEnd > lastIndex) {
      const text = content.slice(lastIndex, proseEnd).trim();
      if (text) chunks.push({ kind: "prose", text });
    }
    chunks.push({ kind: "file", name: m.name });
    const nextStart = i + 1 < matches.length ? matches[i + 1].index : content.length;
    lastIndex = nextStart;
  }

  if (lastIndex < content.length) {
    const tail = content.slice(lastIndex).trim();
    if (tail) chunks.push({ kind: "prose", text: tail });
  }

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

  // Fake-but-plausible cost estimate based on content size (tokens ≈ chars/4).
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
      {chunks.map((c, i) =>
        c.kind === "prose" ? (
          <div key={i} className={PROSE_CLASSES}>
            <ReactMarkdown>{c.text}</ReactMarkdown>
          </div>
        ) : (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-primary/30 bg-primary/10 text-primary text-xs font-medium"
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span className="font-mono">Editing {c.name}</span>
          </div>
        )
      )}

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
