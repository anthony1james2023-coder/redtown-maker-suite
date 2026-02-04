import { useState, useEffect, useRef } from "react";
import { Code, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface LiveCodePanelProps {
  streamingContent: string;
  isStreaming: boolean;
}

const LiveCodePanel = ({ streamingContent, isStreaming }: LiveCodePanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  // Extract code blocks from the streaming content
  const extractCode = (content: string): string => {
    const codeBlockRegex = /```(?:\w+)?\n?([\s\S]*?)(?:```|$)/g;
    const matches: string[] = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    
    return matches.join("\n\n// ---\n\n") || "";
  };

  const currentCode = extractCode(streamingContent);

  // Auto-scroll to bottom when new code comes in
  useEffect(() => {
    if (codeRef.current && isStreaming) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [currentCode, isStreaming]);

  const handleCopy = async () => {
    if (currentCode) {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentCode && !isStreaming) {
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
      <div className="flex items-center justify-between mb-3">
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
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={!currentCode}
            className="h-7 w-7 p-0"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 p-0"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-lg bg-black/50 border border-border/50">
        <pre
          ref={codeRef}
          className="p-4 text-xs font-mono text-green-400 whitespace-pre-wrap break-words overflow-auto"
          style={{ minHeight: isExpanded ? '80vh' : '200px', maxHeight: isExpanded ? '80vh' : '300px' }}
        >
          {currentCode || (isStreaming ? "// Waiting for code..." : "")}
          {isStreaming && <span className="animate-pulse">▋</span>}
        </pre>
      </ScrollArea>

      {currentCode && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{currentCode.split('\n').length} lines</span>
          <span>{currentCode.length} characters</span>
        </div>
      )}
    </div>
  );
};

export default LiveCodePanel;
