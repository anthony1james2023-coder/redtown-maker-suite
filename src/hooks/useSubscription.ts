import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlanType = "starter" | "core" | "team";

export interface PlanFeatures {
  plan: PlanType;
  aiModels: boolean;
  latestModels: boolean;
  maxProjects: number | "unlimited";
  basicHosting: boolean;
  liveHosting: boolean;
  autonomousBuilds: boolean;
  removeBadge: boolean;
  prioritySupport: boolean;
  customDomains: boolean;
  googleSSO: boolean;
  viewerSeats: number;
  centralizedBilling: boolean;
  rbac: boolean;
  privateDeployments: boolean;
  dedicatedSupport: boolean;
}

const planFeatures: Record<PlanType, PlanFeatures> = {
  starter: {
    plan: "starter",
    aiModels: true,
    latestModels: false,
    maxProjects: 5,
    basicHosting: true,
    liveHosting: false,
    autonomousBuilds: false,
    removeBadge: false,
    prioritySupport: false,
    customDomains: false,
    googleSSO: false,
    viewerSeats: 0,
    centralizedBilling: false,
    rbac: false,
    privateDeployments: false,
    dedicatedSupport: false,
  },
  core: {
    plan: "core",
    aiModels: true,
    latestModels: true,
    maxProjects: "unlimited",
    basicHosting: true,
    liveHosting: true,
    autonomousBuilds: true,
    removeBadge: true,
    prioritySupport: true,
    customDomains: true,
    googleSSO: false,
    viewerSeats: 0,
    centralizedBilling: false,
    rbac: false,
    privateDeployments: false,
    dedicatedSupport: false,
  },
  team: {
    plan: "team",
    aiModels: true,
    latestModels: true,
    maxProjects: "unlimited",
    basicHosting: true,
    liveHosting: true,
    autonomousBuilds: true,
    removeBadge: true,
    prioritySupport: true,
    customDomains: true,
    googleSSO: true,
    viewerSeats: 50,
    centralizedBilling: true,
    rbac: true,
    privateDeployments: true,
    dedicatedSupport: true,
  },
};

export const getPlanFeatures = (plan: PlanType): PlanFeatures => planFeatures[plan];

export const useSubscription = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("starter");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlan("starter");
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setPlan(data.plan as PlanType);
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  return { plan, features: getPlanFeatures(plan), loading };
};
