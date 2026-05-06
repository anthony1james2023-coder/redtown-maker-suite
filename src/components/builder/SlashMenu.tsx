import { Plug } from "lucide-react";

export type SlashItem = {
  id: string;
  label: string;
  description: string;
  insert: string;
};

export const SLASH_ITEMS: SlashItem[] = [
  {
    id: "anthropic",
    label: "/anthropic",
    description: "Connect Anthropic Claude AI skill",
    insert: "/anthropic ",
  },
  {
    id: "gemini",
    label: "/google-gemini",
    description: "Connect Google Gemini AI skill",
    insert: "/google-gemini ",
  },
  {
    id: "openai",
    label: "/openai",
    description: "Connect OpenAI GPT skill",
    insert: "/openai ",
  },
  {
    id: "stripe",
    label: "/stripe",
    description: "Connect Stripe payments",
    insert: "/stripe ",
  },
  {
    id: "supabase",
    label: "/database",
    description: "Connect Lovable Cloud database",
    insert: "/database ",
  },
];

export default function SlashMenu({
  query,
  onPick,
}: {
  query: string;
  onPick: (item: SlashItem) => void;
}) {
  const q = query.toLowerCase();
  const items = SLASH_ITEMS.filter(
    (it) => !q || it.label.toLowerCase().includes(q) || it.id.includes(q)
  );
  if (items.length === 0) return null;

  return (
    <div className="absolute bottom-full left-2 mb-2 z-20 w-72 rounded-lg border border-border bg-popover shadow-xl overflow-hidden">
      <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border bg-secondary/40">
        Connectors & integrations
      </div>
      <ul className="max-h-64 overflow-y-auto">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(it);
              }}
              className="w-full flex items-start gap-2 px-3 py-2 hover:bg-secondary text-left"
            >
              <Plug className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-mono text-foreground">{it.label}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {it.description}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
