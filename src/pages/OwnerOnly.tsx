import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Flame, Lock, Check, Crown, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const OWNER_PASSWORD = "kenneth123";

const OwnerOnly = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [streakValue, setStreakValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [activatingPlan, setActivatingPlan] = useState<string | null>(null);

  const handlePasswordSubmit = () => {
    if (password === OWNER_PASSWORD) {
      setAuthenticated(true);
      toast.success("Access granted! 🔓");
    } else {
      toast.error("Wrong password");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <CyberpunkDecorations />
        <Card className="w-full max-w-sm border-border/50">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <CardTitle>Owner Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Enter password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Password"
              />
            </div>
            <Button className="w-full" onClick={handlePasswordSubmit}>
              <Shield className="h-4 w-4 mr-2" /> Unlock
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleActivatePlan = async (plan: "core" | "team") => {
    if (!user) {
      toast.error("You need to sign in first to activate a plan");
      return;
    }

    setActivatingPlan(plan);
    try {
      // Check existing subscription
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (existing) {
        await supabase
          .from("subscriptions")
          .update({ plan, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("subscriptions")
          .insert({ user_id: user.id, plan });
      }

      toast.success(`${plan === "core" ? "Core" : "Team"} plan activated for free! 🎉`);
      navigate("/paid-plan");
    } catch (err) {
      console.error(err);
      toast.error("Failed to activate plan");
    } finally {
      setActivatingPlan(null);
    }
  };

  const handleSetStreak = async () => {
    if (!user) {
      toast.error("Sign in to set streak");
      return;
    }
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
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-4">
      <CyberpunkDecorations />
      <div className="w-full max-w-2xl space-y-6">
        {/* Free Plans */}
        <Card className="border-primary/30">
          <CardHeader className="text-center">
            <Crown className="h-10 w-10 mx-auto text-yellow-500 mb-2" />
            <CardTitle>Activate Free Plan</CardTitle>
            <p className="text-sm text-muted-foreground">
              {user ? "Choose a plan to activate for free" : "Sign in first to activate a plan"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Core */}
              <button
                onClick={() => handleActivatePlan("core")}
                disabled={!user || activatingPlan === "core"}
                className="glass-card p-5 text-left transition-all hover:border-primary/50 disabled:opacity-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-red-500">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold">Core</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">$19/mo — Free for you</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Latest AI models</li>
                  <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Unlimited projects</li>
                  <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Priority support</li>
                </ul>
                <div className="mt-3">
                  <span className="text-xs font-semibold text-primary">
                    {activatingPlan === "core" ? "Activating..." : "Activate Core →"}
                  </span>
                </div>
              </button>

              {/* Team */}
              <button
                onClick={() => handleActivatePlan("team")}
                disabled={!user || activatingPlan === "team"}
                className="glass-card p-5 text-left transition-all hover:border-primary/50 disabled:opacity-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-red-500">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold">Team</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">$49/user/mo — Free for you</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Everything in Core</li>
                  <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> 50 Viewer seats</li>
                  <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Dedicated support</li>
                </ul>
                <div className="mt-3">
                  <span className="text-xs font-semibold text-primary">
                    {activatingPlan === "team" ? "Activating..." : "Activate Team →"}
                  </span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Streak Tool */}
        <Card className="border-primary/30">
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
            <Button className="w-full" onClick={handleSetStreak} disabled={saving || !user}>
              {saving ? "Saving..." : <><Check className="h-4 w-4 mr-2" /> Set Streak</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerOnly;
