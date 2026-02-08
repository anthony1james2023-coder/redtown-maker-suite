import { Brain, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type AIModel = {
  id: string;
  label: string;
  description: string;
  tier: "fast" | "balanced" | "powerful";
};

export const AI_MODELS: AIModel[] = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash", description: "Ultra rápido ⚡", tier: "fast" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Rápido y capaz", tier: "fast" },
  { id: "google/gemini-2.5-flash-lite", label: "Gemini Flash Lite", description: "El más rápido", tier: "fast" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", description: "Razonamiento avanzado 🧠", tier: "powerful" },
  { id: "google/gemini-3-pro-preview", label: "Gemini 3 Pro", description: "Última generación 🔥", tier: "powerful" },
  { id: "openai/gpt-5", label: "GPT-5", description: "Máximo poder 💎", tier: "powerful" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", description: "Equilibrado", tier: "balanced" },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", description: "Rápido y eficiente", tier: "fast" },
  { id: "openai/gpt-5.2", label: "GPT-5.2", description: "Lo más nuevo de OpenAI 🚀", tier: "powerful" },
];

const tierColors = {
  fast: "text-green-400",
  balanced: "text-yellow-400",
  powerful: "text-red-400",
};

const tierLabels = {
  fast: "⚡ Rápidos",
  balanced: "⚖️ Equilibrados",
  powerful: "🔥 Poderosos",
};

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const current = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  const groupedModels = (tier: AIModel["tier"]) => AI_MODELS.filter((m) => m.tier === tier);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7 px-2">
          <Brain className={`w-3.5 h-3.5 ${tierColors[current.tier]}`} />
          <span className="hidden sm:inline">{current.label}</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {(["powerful", "balanced", "fast"] as const).map((tier) => (
          <div key={tier}>
            <DropdownMenuLabel className={`text-xs ${tierColors[tier]}`}>
              {tierLabels[tier]}
            </DropdownMenuLabel>
            {groupedModels(tier).map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={selectedModel === model.id ? "bg-accent" : ""}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{model.label}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
            {tier !== "fast" && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelector;
