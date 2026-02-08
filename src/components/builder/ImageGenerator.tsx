import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string, text: string) => void;
}

const ImageGenerator = ({ onImageGenerated }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const resp = await fetch(IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt: prompt.trim(), quality: "standard" }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        toast.error(err.error || "Failed to generate image");
        return;
      }

      const data = await resp.json();
      if (data.images?.length > 0) {
        const imageUrl = data.images[0].image_url?.url || "";
        onImageGenerated(imageUrl, data.text || "");
        setPrompt("");
        toast.success("¡Imagen generada! 🎨");
      } else {
        toast.error("No image was generated");
      }
    } catch (error) {
      console.error("Image gen error:", error);
      toast.error("Error generating image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="Describe an image to generate..."
          disabled={isGenerating}
          className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-red-500/50 disabled:opacity-50"
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="gap-1.5 border-purple-500/30 hover:bg-purple-500/10 text-xs h-8"
      >
        {isGenerating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <ImagePlus className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">Generate</span>
      </Button>
    </div>
  );
};

export default ImageGenerator;
