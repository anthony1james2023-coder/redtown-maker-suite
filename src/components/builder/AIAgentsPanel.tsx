import { Bot, MessageSquare, Code, Eye, Rocket, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AgentType = "chat" | "coding" | "preview" | "publish";

interface AIAgentsPanelProps {
  isBuilding: boolean;
  buildProgress: number;
  activeAgents: Record<AgentType, number>;
}

const agentConfig = [
  { type: "chat" as AgentType, label: "Chat Monitors", icon: MessageSquare, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  { type: "coding" as AgentType, label: "Coding AIs", icon: Code, color: "text-green-400", bgColor: "bg-green-500/20" },
  { type: "preview" as AgentType, label: "Preview Checkers", icon: Eye, color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  { type: "publish" as AgentType, label: "Publishers", icon: Rocket, color: "text-purple-400", bgColor: "bg-purple-500/20" },
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

  return (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-red-400" />
          <span className="font-semibold text-sm">∞ Infinite AI Workforce</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent font-bold">
            {hasInfinite ? "∞ INFINITE" : "Active"} AIs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {agentConfig.map(({ type, label, icon: Icon, color, bgColor }) => (
          <div
            key={type}
            className={`flex flex-col items-center p-2 rounded-lg ${bgColor} border border-border/30 transition-all ${
              isBuilding ? "ring-2 ring-red-500/50 animate-pulse" : ""
            }`}
          >
            <Icon className={`w-4 h-4 ${color} mb-1`} />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {formatNumber(activeAgents[type])}
            </span>
            <span className="text-[10px] text-muted-foreground text-center">{label}</span>
          </div>
        ))}
      </div>

      {isBuilding && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-green-400" />
              <span className="text-green-400 font-bold">⚡ ULTRA-FAST BUILD (10 sec)</span>
            </div>
            <span className="text-muted-foreground">{Math.round(buildProgress)}%</span>
          </div>
          <Progress value={buildProgress} className="h-2" />
          <p className="text-[10px] text-muted-foreground text-center">
            ∞ Infinite AIs building your masterpiece • 10 seconds to perfection!
          </p>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground text-center mb-2">Powered by</p>
        <div className="flex flex-wrap justify-center gap-1">
          {poweredBy.map((name) => (
            <span
              key={name}
              className="px-2 py-0.5 text-[10px] rounded-full bg-secondary/50 text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAgentsPanel;
