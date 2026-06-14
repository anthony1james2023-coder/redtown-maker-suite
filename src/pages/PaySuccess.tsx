import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Sparkles, Building2, Zap, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { PlanType } from "@/hooks/useSubscription";
import { getPlanFeatures } from "@/hooks/useSubscription";

const planDetails: Record<string, { name: string; icon: typeof Zap; features: string[] }> = {
  core: {
    name: "Core",
    icon: Sparkles,
    features: [
      "Access to AI models",
      "Access to latest models",
      "Unlimited projects",
      "Publish and host live apps",
      "Autonomous long builds",
      "Smarter AI responses",
      'Remove "Redtown" badge',
      "Priority support",
      "Custom domains",
    ],
  },
  team: {
    name: "Team",
    icon: Building2,
    features: [
      "Everything in Core",
      "Google SSO sign-in",
      "Upfront credits on annual",
      "50 Viewer seats",
      "Centralized billing",
      "Role-based access control",
      "Private deployments",
      "Dedicated support",
      "Smarter AI with longer builds",
    ],
  },
};

const PaySuccess = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "core";
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const details = planDetails[planId] || planDetails.core;
  const Icon = details.icon;

  useEffect(() => {
    if (!user || saved) return;

    const saveSubscription = async () => {
      // Check if already has active subscription
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (existing) {
        // Update existing
        await supabase
          .from("subscriptions")
          .update({ plan: planId as PlanType, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        // Insert new
        await supabase
          .from("subscriptions")
          .insert({ user_id: user.id, plan: planId as PlanType });
      }
      setSaved(true);
    };

    saveSubscription();
  }, [user, planId, saved]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6 animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {details.name}
              </span>
              !
            </h1>
            <p className="text-lg text-muted-foreground">
              Your subscription is active. Here's everything you now have access to:
            </p>
          </div>

          {/* Features Card */}
          <div className="glass-card p-8 text-left mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-red-500">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{details.name} Plan</h2>
                <p className="text-sm text-muted-foreground">All features unlocked</p>
              </div>
              <Crown className="w-6 h-6 text-yellow-500 ml-auto" />
            </div>

            <ul className="space-y-3">
              {details.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/builder-agent-2" className="gap-2">
                Start Building <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/profile">View Profile</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaySuccess;
