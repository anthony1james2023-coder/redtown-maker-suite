import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 💳 CREDITS COUNTER — tracks AI requests locally so the user can see how many
// they have left. Free daily quota resets at UTC midnight. Every successful
// AI call decrements the counter via the exported `useCreditsCounter` hook.
const DAILY_QUOTA = 100;
const STORAGE_KEY = "redtown_ai_credits_v1";

type CreditsState = { day: string; used: number };

const today = () => new Date().toISOString().slice(0, 10);

const load = (): CreditsState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CreditsState;
      if (parsed.day === today()) return parsed;
    }
  } catch {}
  return { day: today(), used: 0 };
};

const save = (s: CreditsState) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
};

// Global bus so the counter re-renders when other code spends credits.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

export const spendCredit = (n = 1) => {
  const s = load();
  s.used = Math.min(DAILY_QUOTA, s.used + n);
  save(s);
  notify();
};

export const useCredits = () => {
  const [state, setState] = useState<CreditsState>(load);
  useEffect(() => {
    const update = () => setState(load());
    listeners.add(update);
    const interval = setInterval(update, 30_000); // handle day rollover
    return () => { listeners.delete(update); clearInterval(interval); };
  }, []);
  const remaining = Math.max(0, DAILY_QUOTA - state.used);
  return { remaining, used: state.used, quota: DAILY_QUOTA };
};

const CreditsCounter = () => {
  const { remaining, used, quota } = useCredits();
  const pct = (remaining / quota) * 100;
  const color =
    pct > 50 ? "text-green-400 border-green-500/40 bg-green-500/10"
    : pct > 20 ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
    : "text-red-400 border-red-500/40 bg-red-500/10";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`hidden sm:flex items-center gap-1.5 h-7 px-2 rounded-md border text-xs font-mono ${color}`}>
            <Zap className="h-3 w-3" />
            <span className="font-bold tabular-nums">{remaining}</span>
            <span className="opacity-60">/{quota}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <div className="space-y-0.5">
            <div><b>{remaining}</b> AI credits left today</div>
            <div className="opacity-70">Used {used} of {quota} · resets at 00:00 UTC</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreditsCounter;
