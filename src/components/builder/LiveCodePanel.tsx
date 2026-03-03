import { useState, useEffect, useRef } from "react";
import { Code, Copy, Check, Maximize2, Minimize2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { parseMultiFile, type ParsedFile } from "@/lib/parseMultiFile";

interface LiveCodePanelProps {
  streamingContent: string;
  isStreaming: boolean;
}

const FILE_ICON_COLORS: Record<string, string> = {
  html: "text-orange-400",
  css: "text-blue-400",
  javascript: "text-yellow-400",
  typescript: "text-blue-500",
  json: "text-green-400",
  text: "text-muted-foreground",
};

const LiveCodePanel = ({ streamingContent, isStreaming }: LiveCodePanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);

  const files: ParsedFile[] = parseMultiFile(streamingContent);

  // Reset active tab if files change and index is out of bounds
  useEffect(() => {
    if (activeFileIndex >= files.length && files.length > 0) {
      setActiveFileIndex(0);
    }
  }, [files.length, activeFileIndex]);

  const activeFile = files[activeFileIndex] || null;

  // Auto-scroll to bottom when new code comes in
  useEffect(() => {
    if (codeRef.current && isStreaming) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [activeFile?.content, isStreaming]);

  const handleCopy = async () => {
    if (activeFile?.content) {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      toast.success(`${activeFile.filename} copied!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalLines = files.reduce((sum, f) => sum + f.content.split("\n").length, 0);

  if (files.length === 0 && !isStreaming) {
    return (
      <div className="glass-card p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-4 h-4 text-red-400" />
          <span className="font-semibold text-sm">Live Code</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Code className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No code yet</p>
            <p className="text-xs">Ask the AI to build something!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-4 flex flex-col transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-red-400" />
          <span className="font-semibold text-sm">Live Code</span>
          {isStreaming && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400">Writing...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={handleCopy} disabled={!activeFile} className="h-7 w-7 p-0">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)} className="h-7 w-7 p-0">
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* File Tabs */}
      {files.length > 1 && (
        <div className="flex gap-1 mb-2 overflow-x-auto pb-1 scrollbar-none">
          {files.map((file, i) => (
            <button
              key={file.filename}
              onClick={() => setActiveFileIndex(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                i === activeFileIndex
                  ? "bg-red-500/20 border border-red-500/40 text-red-300"
                  : "bg-secondary/30 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <FileText className={`w-3 h-3 ${FILE_ICON_COLORS[file.language] || "text-muted-foreground"}`} />
              {file.filename}
            </button>
          ))}
        </div>
      )}

      {/* Code Content */}
      <ScrollArea className="flex-1 rounded-lg bg-black/50 border border-border/50">
        <pre
          ref={codeRef}
          className="p-4 text-xs font-mono text-green-400 whitespace-pre-wrap break-words overflow-auto"
          style={{ minHeight: isExpanded ? '80vh' : '200px', maxHeight: isExpanded ? '80vh' : '300px' }}
        >
          {activeFile?.content || (isStreaming ? "// Waiting for code..." : "")}
          {isStreaming && <span className="animate-pulse">▋</span>}
        </pre>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{files.length} file{files.length !== 1 ? "s" : ""} • {totalLines} lines</span>
        {activeFile && <span>{activeFile.filename} — {activeFile.content.length} chars</span>}
      </div>
    </div>
  );
};

export default LiveCodePanel;
