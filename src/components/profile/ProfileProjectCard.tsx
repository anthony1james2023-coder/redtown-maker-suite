import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Check, X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
  };
  onUpdated: () => void;
}

const ProfileProjectCard = ({ project, onUpdated }: ProfileProjectCardProps) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({ name: name.trim(), description: description.trim() || null })
      .eq("id", project.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update project");
    } else {
      toast.success("Project updated!");
      setEditing(false);
      onUpdated();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted");
      onUpdated();
    }
  };

  if (editing) {
    return (
      <Card className="border-primary/50 bg-card/50">
        <CardContent className="p-4 space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" maxLength={100} />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} maxLength={500} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setName(project.name); setDescription(project.description || ""); }} disabled={saving}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 hover:border-primary/50 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={handleDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description || "No description"}</p>
        <p className="text-xs text-muted-foreground mt-2">Created: {new Date(project.created_at).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
};

export default ProfileProjectCard;
