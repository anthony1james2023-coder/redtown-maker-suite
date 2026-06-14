import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileProjectCard from "@/components/profile/ProfileProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History as HistoryIcon, FolderOpen, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back home
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <HistoryIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Your History</h1>
          </div>
          <p className="text-muted-foreground">
            All your saved projects. Edit names, update descriptions, or delete projects you no longer need.
          </p>
        </div>

        {!user ? (
          <div className="text-center py-16 border border-border/50 rounded-2xl">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground mb-4">Sign in to view your project history.</p>
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 border border-border/50 rounded-2xl">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground mb-4">No projects yet — start building!</p>
            <Button asChild>
              <Link to="/builder-agent-2">Open Builder</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProfileProjectCard key={p.id} project={p} onUpdated={fetchProjects} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default History;
