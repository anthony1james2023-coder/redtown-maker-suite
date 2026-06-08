import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReplitLogo from "@/components/ReplitLogo";
import { TEMPLATES } from "@/lib/replTemplates";
import {
  Plus,
  Loader2,
  Search,
  Trash2,
  Code2,
  LogOut,
  Clock,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Repl {
  id: string;
  name: string;
  description: string | null;
  language: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [repls, setRepls] = useState<Repl[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    setDisplayName(meta.full_name || meta.name || user.email?.split("@")[0] || "User");
    setAvatarUrl(meta.avatar_url);
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [user]);

  const loadRepls = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, language, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (error) toast.error("Could not load your Repls");
    else setRepls(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadRepls();
  }, [loadRepls]);

  const handleCreate = async () => {
    if (!user) return;
    const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
    const name = newName.trim() || `${template.label} Repl`;
    setCreating(true);
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        description: template.description,
        language: template.language,
        files: template.files,
        user_id: user.id,
      })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error("Failed to create Repl");
      return;
    }
    setCreateOpen(false);
    setNewName("");
    navigate(`/repl/${data.id}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("projects").delete().eq("id", deleteId);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setRepls((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("Repl deleted");
    }
    setDeleteId(null);
  };

  const filtered = repls.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <Link to="/">
            <ReplitLogo />
          </Link>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> Create Repl
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary/15 text-primary text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Your Repls</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {displayName}.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Repls"
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-elevated p-14 text-center">
            <Code2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {repls.length === 0
                ? "No Repls yet. Create your first one to start coding."
                : "No Repls match your search."}
            </p>
            {repls.length === 0 && (
              <Button className="mt-4 gap-1.5" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" /> Create Repl
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="group relative rounded-xl border border-border bg-surface-elevated p-5 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/repl/${r.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(r.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
                    aria-label="Delete Repl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold mt-4 line-clamp-1 group-hover:text-primary transition-colors">
                  {r.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wide">
                  {r.language}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
                  <Clock className="h-3 w-3" />
                  {new Date(r.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Repl</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Template</label>
              <div className="grid gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`text-left rounded-lg border p-3 transition-colors ${
                      templateId === t.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="font-medium text-sm">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="my-awesome-repl"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating} className="gap-1.5">
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this Repl?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the Repl and all its files. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
