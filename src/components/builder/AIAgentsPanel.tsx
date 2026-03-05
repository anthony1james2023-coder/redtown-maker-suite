import { Bot, MessageSquare, Code, Eye, Rocket, Loader2, Cpu, Zap, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type AgentType = "chat" | "coding" | "preview" | "publish";

interface AIAgentsPanelProps {
  isBuilding: boolean;
  buildProgress: number;
  activeAgents: Record<AgentType, number>;
}

const agentConfig = [
  { type: "chat" as AgentType, label: "Chat Monitors", icon: MessageSquare, color: "text-blue-400", gradient: "from-blue-500/30 to-cyan-500/20", ring: "ring-blue-500/40" },
  { type: "coding" as AgentType, label: "Coding AIs", icon: Code, color: "text-emerald-400", gradient: "from-emerald-500/30 to-green-500/20", ring: "ring-emerald-500/40" },
  { type: "preview" as AgentType, label: "Preview Checkers", icon: Eye, color: "text-amber-400", gradient: "from-amber-500/30 to-yellow-500/20", ring: "ring-amber-500/40" },
  { type: "publish" as AgentType, label: "Publishers", icon: Rocket, color: "text-violet-400", gradient: "from-violet-500/30 to-purple-500/20", ring: "ring-violet-500/40" },
];

const poweredBy = ["Replit", "GitHub", "Lovable", "Cursor", "Claude", "GPT-5", "Gemini", "DeepMind", "xAI", "OpenAI"];

const formatNumber = (num: number): string => {
  if (!isFinite(num)) return "∞";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
};

const AIAgentsPanel = ({ isBuilding, buildProgress, activeAgents }: AIAgentsPanelProps) => {
  const hasInfinite = Object.values(activeAgents).some((v) => !isFinite(v));
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => (p + 1) % 4), 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl p-4 mb-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="w-5 h-5 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <span className="font-bold text-sm tracking-wide">∞ Infinite AI Workforce</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 via-violet-500/20 to-blue-500/20 border border-primary/30 animate-gradient">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-xs font-bold gradient-text">
                {hasInfinite ? "∞ INFINITE" : "Active"} AIs
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {agentConfig.map(({ type, label, icon: Icon, color, gradient, ring }, i) => (
            <div
              key={type}
              className={`relative flex flex-col items-center p-3 rounded-xl bg-gradient-to-br ${gradient} border border-border/30 transition-all duration-500 hover:scale-105 ${
                isBuilding ? `ring-2 ${ring}` : ""
              } ${pulse === i && isBuilding ? "scale-105" : ""}`}
            >
              {isBuilding && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/5 animate-pulse pointer-events-none" />
              )}
              <Icon className={`w-4 h-4 ${color} mb-1.5 ${isBuilding ? "animate-bounce" : ""}`} style={{ animationDelay: `${i * 150}ms` }} />
              <span className="text-2xl font-black gradient-text leading-none">
                {formatNumber(activeAgents[type])}
              </span>
              <span className="text-[10px] text-muted-foreground text-center mt-1 font-medium">{label}</span>
            </div>
          ))}
        </div>

        {isBuilding && (
          <div className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-primary/5 via-green-500/5 to-violet-500/5 border border-primary/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Cpu className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
                  <Zap className="w-2 h-2 text-yellow-400 absolute -top-0.5 -right-0.5" />
                </div>
                <span className="text-primary font-bold tracking-wide">⚡ ULTRA-FAST BUILD</span>
              </div>
              <span className="text-foreground font-mono font-bold">{Math.round(buildProgress)}%</span>
            </div>
            <div className="relative">
              <Progress value={buildProgress} className="h-2.5" />
              <div
                className="absolute top-0 h-2.5 rounded-full bg-gradient-to-r from-primary/50 to-transparent blur-sm transition-all"
                style={{ width: `${buildProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center font-medium">
              ∞ Infinite AIs building your masterpiece • Generating 1MB+ of code
            </p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground text-center mb-2 font-medium uppercase tracking-widest">Powered by</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {poweredBy.map((name, i) => (
              <span
                key={name}
                className="px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-secondary/80 to-secondary/40 text-muted-foreground border border-border/20 font-medium hover:text-foreground hover:border-primary/30 transition-colors cursor-default"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentsPanel;
