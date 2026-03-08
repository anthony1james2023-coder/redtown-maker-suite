import { useState, useRef, useEffect } from "react";
import { Eye, Maximize2, Minimize2, RefreshCw, Loader2, Box, Smartphone, Tablet, Monitor, Terminal, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseMultiFile, combineFiles } from "@/lib/parseMultiFile";

interface LivePreviewPanelProps {
  streamingContent: string;
  isStreaming: boolean;
}

type DeviceFrame = "desktop" | "tablet" | "phone";

const DEVICE_SIZES: Record<DeviceFrame, { width: string; height: string; label: string }> = {
  desktop: { width: "100%", height: "100%", label: "Desktop" },
  tablet: { width: "768px", height: "1024px", label: "Tablet" },
  phone: { width: "375px", height: "667px", label: "Phone" },
};

const EMPTY_HTML = `<!DOCTYPE html>
<html>
<head><style>
body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f0f23 100%);
  font-family:system-ui,-apple-system,sans-serif; color:#888; }
.waiting { text-align:center; }
.cube { width:60px; height:60px; margin:0 auto 20px; transform-style:preserve-3d; animation:rotate 4s linear infinite; }
@keyframes rotate { from{transform:rotateX(0) rotateY(0)} to{transform:rotateX(360deg) rotateY(360deg)} }
.cube div { position:absolute; width:60px; height:60px; border:2px solid rgba(239,68,68,.5); background:rgba(239,68,68,.1); }
.front{transform:translateZ(30px)} .back{transform:translateZ(-30px) rotateY(180deg)}
.left{transform:translateX(-30px) rotateY(-90deg)} .right{transform:translateX(30px) rotateY(90deg)}
.top{transform:translateY(-30px) rotateX(90deg)} .bottom{transform:translateY(30px) rotateX(-90deg)}
</style></head>
<body><div class="waiting">
<div class="cube"><div class="front"></div><div class="back"></div><div class="left"></div><div class="right"></div><div class="top"></div><div class="bottom"></div></div>
<p>Waiting for AI to build something...</p>
<p style="font-size:12px;opacity:.6">Ask the AI to create a game or 3D app!</p>
</div></body></html>`;

// Inject console capture script into HTML
function injectConsoleCapture(html: string): string {
  const script = `<script>
(function(){
  var _logs = [];
  var _origLog = console.log, _origErr = console.error, _origWarn = console.warn;
  function send(level, args) {
    try { window.parent.postMessage({ type:'__preview_console', level:level, args: Array.from(args).map(function(a){ try{return typeof a==='object'?JSON.stringify(a):String(a)}catch(e){return String(a)} }) }, '*'); } catch(e){}
  }
  console.log = function(){ send('log', arguments); _origLog.apply(console, arguments); };
  console.error = function(){ send('error', arguments); _origErr.apply(console, arguments); };
  console.warn = function(){ send('warn', arguments); _origWarn.apply(console, arguments); };
  window.onerror = function(msg,src,line,col,err){ send('error', [msg + ' (line '+line+')']); };
})();
</script>`;
  if (html.includes("<head>")) {
    return html.replace("<head>", "<head>" + script);
  }
  return script + html;
}

type ConsoleLine = { level: string; text: string; id: number };

const LivePreviewPanel = ({ streamingContent, isStreaming }: LivePreviewPanelProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);
  const [device, setDevice] = useState<DeviceFrame>("desktop");
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLine[]>([]);
  const consoleIdRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const files = parseMultiFile(streamingContent);
  const previewHtml = files.length > 0 ? combineFiles(files) : "";

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "__preview_console") {
        const line: ConsoleLine = {
          level: e.data.level,
          text: e.data.args?.join(" ") || "",
          id: consoleIdRef.current++,
        };
        setConsoleLogs((prev) => [...prev.slice(-200), line]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Clear console on refresh
  useEffect(() => {
    setConsoleLogs([]);
  }, [key]);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLogs]);

  const getFullHtml = (content: string): string => {
    if (!content) return EMPTY_HTML;
    let html = content;
    if (!html.includes("<!DOCTYPE") && !html.includes("<html")) {
      html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:white;min-height:100vh}canvas{display:block}</style>
</head><body>${html}</body></html>`;
    }
    return injectConsoleCapture(html);
  };

  const deviceSize = DEVICE_SIZES[device];

  const levelColor: Record<string, string> = {
    log: "text-green-400",
    warn: "text-yellow-400",
    error: "text-red-400",
  };

  return (
    <div className={`glass-card flex flex-col ${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <Box className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Live Preview</span>
          {isStreaming && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30">
              <Loader2 className="w-3 h-3 text-green-400 animate-spin" />
              <span className="text-[10px] text-green-400">Building...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {/* Device Switcher */}
          <div className="flex items-center bg-secondary/50 rounded-lg p-0.5 mr-1">
            <button
              onClick={() => setDevice("phone")}
              className={`p-1 rounded-md transition-colors ${device === "phone" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              title="Phone"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-1 rounded-md transition-colors ${device === "tablet" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              title="Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className={`p-1 rounded-md transition-colors ${device === "desktop" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              title="Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowConsole(!showConsole)} title="Toggle console">
            <Terminal className={`w-3.5 h-3.5 ${showConsole ? "text-primary" : ""}`} />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setKey(k => k + 1)} title="Refresh preview">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* URL Bar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-border/30 bg-secondary/20">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/40 border border-border/30 text-[10px] text-muted-foreground font-mono">
          <span className="text-green-400">🔒</span>
          <span>preview://localhost</span>
          <span className="text-primary/60">/{deviceSize.label.toLowerCase()}</span>
        </div>
      </div>

      {/* Preview Area */}
      <div className={`flex-1 relative bg-black/50 overflow-hidden flex items-start justify-center ${!showConsole ? 'rounded-b-lg' : ''}`}>
        <div
          className="transition-all duration-300"
          style={{
            width: device === "desktop" ? "100%" : deviceSize.width,
            height: device === "desktop" ? "100%" : deviceSize.height,
            maxWidth: "100%",
            maxHeight: "100%",
            ...(device !== "desktop" && {
              border: "2px solid hsl(var(--border))",
              borderRadius: "12px",
              overflow: "hidden",
              margin: "8px auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }),
          }}
        >
          <iframe
            key={key}
            ref={iframeRef}
            srcDoc={getFullHtml(previewHtml)}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none border border-primary/10 rounded-b-lg" />
      </div>

      {/* Console Panel */}
      {showConsole && (
        <div className="h-32 flex flex-col border-t border-border/50 bg-black/80">
          <div className="flex items-center justify-between px-2 py-1 border-b border-border/30">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Console</span>
              {consoleLogs.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                  {consoleLogs.length}
                </span>
              )}
            </div>
            <button onClick={() => setConsoleLogs([])} className="text-[10px] text-muted-foreground hover:text-foreground">
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-1 font-mono text-[10px] space-y-0.5">
            {consoleLogs.length === 0 && (
              <p className="text-muted-foreground/50 italic">No console output yet...</p>
            )}
            {consoleLogs.map((log) => (
              <div key={log.id} className={`${levelColor[log.level] || "text-foreground"} break-all`}>
                <span className="text-muted-foreground/50 mr-1">{log.level === "error" ? "✕" : log.level === "warn" ? "⚠" : "›"}</span>
                {log.text}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-2 py-1.5 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3 h-3" />
          {previewHtml ? `${files.length} file${files.length !== 1 ? "s" : ""} • ${deviceSize.label}` : "No preview yet"}
        </span>
        <span className="text-primary/60">Powered by ∞ AIs</span>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
