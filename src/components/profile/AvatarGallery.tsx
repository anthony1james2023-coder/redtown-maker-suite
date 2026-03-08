import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Zoe",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Mia",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Jack",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Robot3",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Robot4",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Happy",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Cool",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Love",
  "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Star",
  "https://api.dicebear.com/9.x/pixel-art/svg?seed=Pixel1",
  "https://api.dicebear.com/9.x/pixel-art/svg?seed=Pixel2",
  "https://api.dicebear.com/9.x/pixel-art/svg?seed=Pixel3",
  "https://api.dicebear.com/9.x/pixel-art/svg?seed=Pixel4",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Thumb1",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Thumb2",
];

interface AvatarGalleryProps {
  selected: string | null;
  onSelect: (url: string) => void;
}

const AvatarGallery = ({ selected, onSelect }: AvatarGalleryProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Or pick a preset avatar:</p>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {PRESET_AVATARS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onSelect(url)}
            className={cn(
              "relative h-10 w-10 rounded-full overflow-hidden border-2 transition-all hover:scale-110",
              selected === url ? "border-primary ring-2 ring-primary/30" : "border-border/50 hover:border-primary/50"
            )}
          >
            <img src={url} alt="Avatar preset" className="h-full w-full object-cover bg-muted" />
            {selected === url && (
              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarGallery;
