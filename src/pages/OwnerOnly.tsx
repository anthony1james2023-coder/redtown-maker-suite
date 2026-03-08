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

const OWNER_PASSWORD = "123kenneth";

const OwnerOnly = () => {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [streakValue, setStreakValue] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleUnlock = () => {
    if (password === OWNER_PASSWORD) {
      setUnlocked(true);
      toast.success("Access granted!");
    } else {
      toast.error("Wrong password");
    }
  };

  const handleSetStreak = async () => {
    const days = parseInt(streakValue);
    if (isNaN(days) || days < 1) {
      toast.error("Enter a valid number (1 or more)");
      return;
    }

    setSaving(true);
    try {
      // Delete existing visits
      await supabase.from("daily_visits").delete().eq("user_id", user.id);

      // Insert consecutive days ending today
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

      // Insert in batches of 500
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

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm border-border/50">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <CardTitle>Owner Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="Enter owner password"
              />
            </div>
            <Button className="w-full" onClick={handleUnlock}>
              <Shield className="h-4 w-4 mr-2" />
              Unlock
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
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
