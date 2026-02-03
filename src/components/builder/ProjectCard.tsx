import { Play, Eye, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  previewHtml?: string;
  createdAt: string;
  onPlay: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ id, name, description, previewHtml, createdAt, onPlay, onDelete }: ProjectCardProps) => {
  return (
    <div className="glass-card p-4 flex flex-col gap-3 group hover:border-red-500/30 transition-all">
      {/* Preview Thumbnail */}
      <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden relative">
        {previewHtml ? (
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0 pointer-events-none"
            title={name}
            sandbox="allow-scripts"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Eye className="w-8 h-8 opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="hero" onClick={() => onPlay(id)} className="gap-1">
            <Play className="w-4 h-4" />
            Play
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm truncate">{name}</h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
