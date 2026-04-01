import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Flame, Lock, Check } from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

// Owner emails allowed to access this page (server-side validation should also be used)
const OWNER_EMAILS = ["kennethchatfield7@gmail.com"];

const OwnerOnly = () => {
  const { user, loading } = useAuth();
  const [streakValue, setStreakValue] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isOwner = OWNER_EMAILS.includes(user.email ?? "");

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <CyberpunkDecorations />
        <Card className="w-full max-w-sm border-border/50">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>This page is restricted to authorized owners only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSetStreak = async () => {
    const days = parseInt(streakValue);
    if (isNaN(days) || days < 1) {
      toast.error("Enter a valid number (1 or more)");
      return;
    }

    setSaving(true);
    try {
      await supabase.from("daily_visits").delete().eq("user_id", user.id);

      const rows = [];
      const today = new Date();
      for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        rows.push({
          user_id: user.id,
          visited_date: d.toISOString().split("T")[0],
        });
      }

      for (let i = 0; i < rows.length; i += 500) {
        const batch = rows.slice(i, i + 500);
        const { error } = await supabase.from("daily_visits").upsert(batch, {
          onConflict: "user_id,visited_date",
        });
        if (error) throw error;
      }

      toast.success(`Streak set to ${days} days! 🔥`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to set streak");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <CyberpunkDecorations />
      <Card className="w-full max-w-sm border-primary/30">
        <CardHeader className="text-center">
          <Flame className="h-10 w-10 mx-auto text-destructive mb-2" />
          <CardTitle>Set Your Streak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Number of days</Label>
            <Input
              type="number"
              min={1}
              value={streakValue}
              onChange={(e) => setStreakValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetStreak()}
              placeholder="e.g. 365"
            />
          </div>
          <Button className="w-full" onClick={handleSetStreak} disabled={saving}>
            {saving ? "Saving..." : <><Check className="h-4 w-4 mr-2" /> Set Streak</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerOnly;
