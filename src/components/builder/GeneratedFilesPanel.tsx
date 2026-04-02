import { useEffect, useMemo, useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { parseMultiFile, type ParsedFile } from "@/lib/parseMultiFile";
import { toast } from "sonner";

interface GeneratedFilesPanelProps {
  streamingContent: string;
  isStreaming: boolean;
}

const GeneratedFilesPanel = ({ streamingContent, isStreaming }: GeneratedFilesPanelProps) => {
  const files = useMemo(() => parseMultiFile(streamingContent), [streamingContent]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (files.length === 0) {
      setSelectedPath(null);
      return;
    }

    if (!selectedPath || !files.some((file) => file.path === selectedPath)) {
      setSelectedPath(files[0].path);
    }
  }, [files, selectedPath]);

  const activeFile: ParsedFile | null =
    files.find((file) => file.path === selectedPath) ?? files[0] ?? null;

  const totalLines = files.reduce(
    (sum, file) => sum + file.content.split("\n").length,
    0
  );

  const handleCopy = async () => {
    if (!activeFile) return;

    await navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    toast.success(`${activeFile.filename} copied`);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (files.length === 0 && !isStreaming) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <div className="space-y-2">
          <FileCode2 className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">No files yet</p>
          <p className="text-xs text-muted-foreground">
            Ask Agent 2 to build something, then open a file to read the code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Generated files
          </p>
          <p className="truncate text-sm text-foreground">
            {activeFile ? activeFile.path : isStreaming ? "Waiting for files..." : "No file selected"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] text-muted-foreground sm:inline">
            {files.length} file{files.length !== 1 ? "s" : ""} • {totalLines} lines
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            disabled={!activeFile}
            className="h-7 w-7"
            title="Copy current file"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      <div className="border-b border-border/30 px-2 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {files.map((file) => {
            const isActive = file.path === activeFile?.path;

            return (
              <button
                key={file.path}
                onClick={() => setSelectedPath(file.path)}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-1.5 text-left transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-secondary/40 hover:bg-secondary"
                )}
              >
                <span className="block text-xs font-medium text-foreground">{file.filename}</span>
                <span className="block text-[10px] text-muted-foreground">
                  {file.folder || "root"}
                </span>
              </button>
            );
          })}

          {isStreaming && files.length === 0 && (
            <div className="rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground">
              Waiting for files...
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 bg-secondary/20">
        <pre className="min-h-full whitespace-pre-wrap break-words p-4 font-mono text-xs leading-5 text-foreground">
          {activeFile?.content || (isStreaming ? "// Waiting for code..." : "")}
          {isStreaming && <span className="animate-pulse text-primary">▋</span>}
        </pre>
      </ScrollArea>
    </div>
  );
};

export default GeneratedFilesPanel;
