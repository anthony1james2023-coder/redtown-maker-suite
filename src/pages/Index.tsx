import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles, ChevronDown, Loader2, FolderOpen, Clock } from "lucide-react";
import { toast } from "sonner";
import TopNav from "@/components/TopNav";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Resolve a friendly display name
  useEffect(() => {
    if (!user) {
      setDisplayName("");
      return;
    }
    const fromMeta =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      "";
    setDisplayName(fromMeta || user.email?.split("@")[0] || "there");

    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user]);

  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setProjectsLoading(false);
      return;
    }
    setProjectsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Could not load your projects");
    } else {
      setProjects(data ?? []);
    }
    setProjectsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadProjects();
  }, [authLoading, loadProjects]);

  const handleSubmit = async () => {
    const text = prompt.trim();
    if (!text) return;
    if (!user) {
      toast.error("Please sign in to start creating");
      navigate("/welcome");
      return;
    }
    setSubmitting(true);
    const name = text.length > 60 ? `${text.slice(0, 60)}…` : text;
    const { data, error } = await supabase
      .from("projects")
      .insert({ name, description: text, user_id: user.id })
      .select("id, name, description, created_at")
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error("Failed to create project");
      return;
    }
    setProjects((prev) => [data, ...prev]);
    setPrompt("");
    toast.success("Project created");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <TopNav />
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-destructive/10 rounded-full blur-[140px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            Redtown 2
          </div>

          {user && (
            <p className="text-xl md:text-2xl text-muted-foreground">
              Hi{" "}
              <span className="font-semibold text-foreground">{displayName}</span>
            </p>
          )}

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            What do you want to{" "}
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              create
            </span>
            ?
          </h1>

          {/* Chat bar */}
          <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-2xl shadow-primary/5 p-3 text-left">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Describe what you want to build…"
              rows={2}
              className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base shadow-none"
            />
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground font-mono">
                {user ? "Press Enter to create" : "Sign in to start"}
              </span>
              <Button
                size="icon"
                onClick={handleSubmit}
                disabled={submitting || !prompt.trim()}
                className="rounded-full"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <button
          onClick={scrollToProjects}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        >
          <span className="text-xs font-mono uppercase tracking-widest">
            Your projects
          </span>
          <ChevronDown className="h-5 w-5" />
        </button>
      </section>

      {/* Projects */}
      <section id="projects" className="relative z-10 px-4 py-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <FolderOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">Your Projects</h2>
        </div>

        {projectsLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-border bg-card/40 p-12 text-center">
            <p className="text-muted-foreground">
              Sign in to see your projects.
            </p>
            <Button className="mt-4" onClick={() => navigate("/welcome")}>
              Sign in
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
            <p className="text-muted-foreground">
              No projects yet. Use the chat bar above to create your first one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5 hover:border-primary/40 transition-colors"
              >
                <h3 className="font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {p.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Clock className="h-3 w-3" />
                  {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
