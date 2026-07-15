import { useEffect, useState } from "react";
import { Zap, AlertTriangle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 💳 REAL CREDITS STATUS — the Lovable AI Gateway does NOT expose a balance
// endpoint that browser apps can query. So instead of a fake local quota, this
// component reflects the ACTUAL last response from the gateway:
//   • ok           → last call succeeded (credits available)
//   • rate_limited → last call returned 429 (temporarily throttled)
//   • exhausted    → last call returned 402 (workspace AI credits used up)
//   • unknown      → no calls yet this session
//
// The chat page reports status via `reportAiStatus(...)` after every request.

export type AiStatus = "unknown" | "ok" | "rate_limited" | "exhausted";

const STORAGE_KEY = "redtown_ai_status_v2";

type Stored = { status: AiStatus; at: number; count: number };

const load = (): Stored => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Stored;
  } catch {}
  return { status: "unknown", at: 0, count: 0 };
};

const save = (s: Stored) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

export const reportAiStatus = (status: AiStatus) => {
  const prev = load();
  save({ status, at: Date.now(), count: prev.count + (status === "ok" ? 1 : 0) });
  notify();
};

const useAiStatus = () => {
  const [s, setS] = useState<Stored>(load);
  useEffect(() => {
    const upd = () => setS(load());
    listeners.add(upd);
    return () => { listeners.delete(upd); };
  }, []);
  return s;
};

const CreditsCounter = () => {
  const { status, count } = useAiStatus();

  const meta = {
    unknown:      { Icon: Zap,           label: "Ready",       cls: "text-muted-foreground border-border bg-muted/30", tip: "No AI calls yet this session." },
    ok:           { Icon: Zap,           label: "Credits OK",  cls: "text-green-400 border-green-500/40 bg-green-500/10", tip: `Last AI call succeeded. ${count} successful call${count === 1 ? "" : "s"} this session.` },
    rate_limited: { Icon: AlertTriangle, label: "Rate limit",  cls: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10", tip: "Gateway returned 429 — too many requests. Wait a moment and try again." },
    exhausted:    { Icon: XCircle,       label: "No credits",  cls: "text-red-400 border-red-500/40 bg-red-500/10", tip: "Gateway returned 402 — your workspace AI credits are used up. Add credits in Workspace → Plans & credits." },
  }[status];

  const { Icon } = meta;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`hidden sm:flex items-center gap-1.5 h-7 px-2 rounded-md border text-xs font-medium ${meta.cls}`}>
            <Icon className="h-3 w-3" />
            <span>{meta.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-[240px]">
          {meta.tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Legacy no-op export so existing imports don't break.
export const spendCredit = () => {};

export default CreditsCounter;
