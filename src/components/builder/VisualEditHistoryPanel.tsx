import { useState } from "react";
import { History, ChevronDown, ChevronRight, FilePlus2, FileMinus2, FilePen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FileDiff, DiffLine } from "@/lib/lineDiff";

export interface VisualEditEntry {
  id: string;
  timestamp: number;
  prompt: string;
  diffs: FileDiff[];
}

interface Props {
  entries: VisualEditEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StatusIcon = ({ status }: { status: FileDiff["status"] }) => {
  if (status === "added") return <FilePlus2 className="h-3.5 w-3.5 text-emerald-500" />;
  if (status === "removed") return <FileMinus2 className="h-3.5 w-3.5 text-rose-500" />;
  return <FilePen className="h-3.5 w-3.5 text-amber-500" />;
};

const DiffLineRow = ({ line }: { line: DiffLine }) => {
  const bg =
    line.op === "add"
      ? "bg-emerald-500/10 text-emerald-300"
      : line.op === "del"
      ? "bg-rose-500/10 text-rose-300"
      : "text-muted-foreground";
  const sign = line.op === "add" ? "+" : line.op === "del" ? "-" : " ";
  return (
    <div className={`flex font-mono text-[11px] leading-[1.35] px-2 ${bg}`}>
      <span className="w-8 text-right pr-2 opacity-50 select-none">{line.oldNo ?? ""}</span>
      <span className="w-8 text-right pr-2 opacity-50 select-none">{line.newNo ?? ""}</span>
      <span className="w-4 select-none">{sign}</span>
      <span className="whitespace-pre-wrap break-all flex-1">{line.text || " "}</span>
    </div>
  );
};

const FileDiffBlock = ({ diff }: { diff: FileDiff }) => {
  const [open, setOpen] = useState(true);
  // Cap very long diffs so the panel stays usable
  const MAX = 200;
  const displayed = diff.lines.length > MAX ? diff.lines.slice(0, MAX) : diff.lines;
  return (
    <div className="border border-border rounded-md overflow-hidden bg-secondary/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-secondary/60 text-left"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <StatusIcon status={diff.status} />
        <span className="text-xs font-mono truncate flex-1">{diff.path}</span>
        <span className="text-[10px] text-emerald-400">+{diff.added}</span>
        <span className="text-[10px] text-rose-400">-{diff.removed}</span>
      </button>
      {open && (
        <div className="border-t border-border max-h-72 overflow-auto">
          {displayed.map((l, i) => (
            <DiffLineRow key={i} line={l} />
          ))}
          {diff.lines.length > MAX && (
            <div className="px-2 py-1 text-[10px] text-muted-foreground italic">
              … {diff.lines.length - MAX} more lines truncated
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EntryCard = ({ entry }: { entry: VisualEditEntry }) => {
  const [open, setOpen] = useState(false);
  const totalAdd = entry.diffs.reduce((s, d) => s + d.added, 0);
  const totalDel = entry.diffs.reduce((s, d) => s + d.removed, 0);
  const time = new Date(entry.timestamp).toLocaleTimeString();
  return (
    <div className="border border-border rounded-lg bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-2 p-3 text-left hover:bg-secondary/40"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 mt-0.5 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">{time}</div>
          <div className="text-sm text-foreground line-clamp-2">{entry.prompt}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="text-muted-foreground">{entry.diffs.length} file{entry.diffs.length === 1 ? "" : "s"}</span>
            <span className="text-emerald-400">+{totalAdd}</span>
            <span className="text-rose-400">-{totalDel}</span>
          </div>
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          {entry.diffs.length === 0 ? (
            <div className="text-xs text-muted-foreground italic">No file changes detected.</div>
          ) : (
            entry.diffs.map((d) => <FileDiffBlock key={d.path} diff={d} />)
          )}
        </div>
      )}
    </div>
  );
};

const VisualEditHistoryPanel = ({ entries, open, onOpenChange }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            Visual Edit History
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ({entries.length})
            </span>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {entries.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-12">
                No visual edits yet. Toggle <span className="text-primary">Edit</span> mode and ask
                for a style change to record one here.
              </div>
            ) : (
              entries.map((e) => <EntryCard key={e.id} entry={e} />)
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default VisualEditHistoryPanel;
