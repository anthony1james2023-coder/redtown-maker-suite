import { FileCode2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

/**
 * Splits an assistant message into prose chunks and "file pill" chunks.
 * Any block of the form `--- FILE: path ---\n<code...>` is replaced with a
 * small pill showing "Editing <filename>" instead of dumping the raw code
 * into the chat.
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
    // Prose before this file marker
    const proseEnd = m.index;
    if (proseEnd > lastIndex) {
      const text = content.slice(lastIndex, proseEnd).trim();
      if (text) chunks.push({ kind: "prose", text });
    }
    chunks.push({ kind: "file", name: m.name });
    // Skip the code body until the next file marker (or end)
    const nextStart = i + 1 < matches.length ? matches[i + 1].index : content.length;
    lastIndex = nextStart;
  }

  // Trailing prose after the last file (the outro the AI writes)
  if (lastIndex < content.length) {
    const tail = content.slice(lastIndex).trim();
    if (tail) chunks.push({ kind: "prose", text: tail });
  }

  return chunks;
}

const PROSE_CLASSES =
  "prose prose-sm max-w-none [&>*]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_code]:bg-secondary [&_code]:text-primary [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-secondary/80 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_a]:text-primary";

export default function AssistantMessage({ content }: { content: string }) {
  const chunks = splitContent(content);

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
    </div>
  );
}
