import { useState, useEffect } from "react";
import { FolderOpen, Plus, Maximize2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProjectCard from "./ProjectCard";
import { downloadGame } from "@/lib/downloadGame";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  preview_html: string | null;
  created_at: string;
}

interface ProjectsPanelProps {
  onNewProject?: () => void;
}

const ProjectsPanel = ({ onNewProject }: ProjectsPanelProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingProject, setPlayingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handlePlay = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setPlayingProject(project);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <>
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-sm">Your Projects</span>
            <span className="text-xs text-muted-foreground">({projects.length})</span>
          </div>
          <Button size="sm" variant="ghost" onClick={onNewProject} className="gap-1 text-xs">
            <Plus className="w-3 h-3" />
            New
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-secondary/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No projects yet</p>
            <p className="text-xs">Start building to see your projects here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description || undefined}
                previewHtml={project.preview_html || undefined}
                createdAt={project.created_at}
                onPlay={handlePlay}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Play Dialog */}
      <Dialog open={!!playingProject} onOpenChange={() => setPlayingProject(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-red-400" />
                {playingProject?.name}
              </DialogTitle>
              {playingProject?.preview_html && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    downloadGame(playingProject.preview_html!, playingProject.name);
                    toast.success("Game downloaded!");
                  }}
                  className="gap-2 border-red-500/30 hover:bg-red-500/10"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 h-full">
            {playingProject?.preview_html ? (
              <iframe
                srcDoc={playingProject.preview_html}
                className="w-full h-full border-0"
                title={playingProject.name}
                sandbox="allow-scripts"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p>No preview available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectsPanel;
