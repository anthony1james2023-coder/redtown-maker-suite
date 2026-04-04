import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Check, X, Sparkles, Building2, Zap, ArrowRight, Crown, Bot, Clock, Globe, Users, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import type { PlanType } from "@/hooks/useSubscription";

interface FeatureRow {
  name: string;
  icon: typeof Zap;
  starter: boolean | string;
  core: boolean | string;
  team: boolean | string;
}

const features: FeatureRow[] = [
  { name: "Access to AI models", icon: Bot, starter: true, core: true, team: true },
  { name: "Smarter AI (latest models)", icon: Sparkles, starter: false, core: true, team: true },
  { name: "Projects", icon: Rocket, starter: "5", core: "Unlimited", team: "Unlimited" },
  { name: "Basic hosting", icon: Globe, starter: true, core: true, team: true },
  { name: "Publish & host live apps", icon: Globe, starter: false, core: true, team: true },
  { name: "Autonomous long builds", icon: Clock, starter: false, core: true, team: true },
  { name: 'Remove "Redtown" badge', icon: Shield, starter: false, core: true, team: true },
  { name: "Priority support", icon: Zap, starter: false, core: true, team: true },
  { name: "Custom domains", icon: Globe, starter: false, core: true, team: true },
  { name: "Google SSO sign-in", icon: Users, starter: false, core: false, team: true },
  { name: "50 Viewer seats", icon: Users, starter: false, core: false, team: true },
  { name: "Centralized billing", icon: Shield, starter: false, core: false, team: true },
  { name: "Role-based access control", icon: Shield, starter: false, core: false, team: true },
  { name: "Private deployments", icon: Shield, starter: false, core: false, team: true },
  { name: "Dedicated support", icon: Crown, starter: false, core: false, team: true },
];

const planMeta: Record<PlanType, { name: string; icon: typeof Zap; color: string }> = {
  starter: { name: "Starter", icon: Zap, color: "text-muted-foreground" },
  core: { name: "Core", icon: Sparkles, color: "text-primary" },
  team: { name: "Team", icon: Building2, color: "text-primary" },
};

const PaidPlan = () => {
  const { user, loading: authLoading } = useAuth();
  const { plan, loading: subLoading } = useSubscription();

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const meta = planMeta[plan];
  const Icon = meta.icon;

  const renderCell = (value: boolean | string, isCurrentPlan: boolean) => {
    if (typeof value === "string") {
      return <span className={isCurrentPlan ? "font-semibold text-foreground" : "text-muted-foreground"}>{value}</span>;
    }
    return value ? (
      <Check className={`w-5 h-5 ${isCurrentPlan ? "text-green-500" : "text-muted-foreground/50"}`} />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/20" />
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-500 mb-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              Your{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {meta.name}
              </span>{" "}
              Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              {plan === "starter"
                ? "You're on the free plan. Upgrade to unlock more features."
                : `You have access to all ${meta.name} features.`}
            </p>
          </div>

          {/* Features Table */}
          <div className="glass-card overflow-hidden mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-2 p-4 border-b border-border/50 text-sm font-semibold">
              <div>Feature</div>
              <div className={`text-center ${plan === "starter" ? "text-primary" : ""}`}>Starter</div>
              <div className={`text-center ${plan === "core" ? "text-primary" : ""}`}>Core</div>
              <div className={`text-center ${plan === "team" ? "text-primary" : ""}`}>Team</div>
            </div>

            {/* Rows */}
            {features.map((feature, i) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-4 gap-2 p-4 items-center text-sm ${
                    i % 2 === 0 ? "bg-secondary/20" : ""
                  } ${
                    // Highlight row if this feature is included in user's plan
                    (plan === "starter" && feature.starter) ||
                    (plan === "core" && feature.core) ||
                    (plan === "team" && feature.team)
                      ? ""
                      : "opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FeatureIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{feature.name}</span>
                  </div>
                  <div className="flex justify-center">{renderCell(feature.starter, plan === "starter")}</div>
                  <div className="flex justify-center">{renderCell(feature.core, plan === "core")}</div>
                  <div className="flex justify-center">{renderCell(feature.team, plan === "team")}</div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {plan === "starter" && (
            <div className="text-center glass-card p-8">
              <h2 className="text-2xl font-bold mb-2">Upgrade to unlock everything</h2>
              <p className="text-muted-foreground mb-4">Get smarter AI, longer builds, and unlimited projects.</p>
              <div className="flex gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/pay" className="gap-2">
                    Upgrade Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {plan !== "starter" && (
            <div className="text-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/builder-agent-2" className="gap-2">
                  Start Building <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaidPlan;
