import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, FolderOpen, Plus, Loader2, Pencil, Check, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import AvatarGallery from "@/components/profile/AvatarGallery";

const Profile = () => {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [presetAvatar, setPresetAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["user-projects", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || "User";
  const email = user.email;
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  const startEditing = () => {
    setEditName(displayName);
    setAvatarPreview(null);
    setAvatarFile(null);
    setPresetAvatar(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setPresetAvatar(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setPresetAvatar(null);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let newAvatarUrl = profile?.avatar_url || null;

      if (presetAvatar) {
        newAvatarUrl = presetAvatar;
      } else if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/avatar.${ext}`;

        // Ensure bucket exists - upload will work if bucket is set up
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload avatar. Using previous avatar.");
        } else {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(path);
          newAvatarUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: editName.trim() || null,
          avatar_url: newAvatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      toast.success("Profile updated!");
      setEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
      setPresetAvatar(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = presetAvatar || avatarPreview || avatarUrl;

  const handlePresetSelect = (url: string) => {
    setPresetAvatar(url);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Your Profile</CardTitle>
              {!editing && (
                <Button size="sm" variant="outline" onClick={startEditing}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-[100px] w-[100px] cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <AvatarImage src={currentAvatar || undefined} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {(editName || displayName)[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Pencil className="h-5 w-5 text-foreground" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="space-y-4 flex-1 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={100}
                        placeholder="Your display name"
                      />
                    </div>
                    <AvatarGallery selected={presetAvatar} onSelect={handlePresetSelect} />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{email}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditing} disabled={saving}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="h-[100px] w-[100px]">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {displayName[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-semibold">{displayName}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{email}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Your Projects
              </CardTitle>
              <Link to="/builder">
                <Button size="sm" variant="hero">
                  <Plus className="h-4 w-4 mr-1" />
                  New Project
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((project) => (
                    <Card key={project.id} className="border-border/50 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {project.description || "No description"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>You don't have any projects yet.</p>
                  <Link to="/builder" className="text-primary hover:underline text-sm">
                    Create your first project
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
