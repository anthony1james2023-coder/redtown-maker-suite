import { useState, useEffect, useCallback } from "react";

type AgentType = "chat" | "coding" | "preview" | "publish";

const DEFAULT_AGENTS: Record<AgentType, number> = {
  chat: 1000000,
  coding: 5000000,
  preview: 1000000,
  publish: 3000000,
};

const BUILD_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAIBuilding = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [activeAgents, setActiveAgents] = useState<Record<AgentType, number>>(DEFAULT_AGENTS);
  const [buildStartTime, setBuildStartTime] = useState<number | null>(null);

  const startBuilding = useCallback(() => {
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildStartTime(Date.now());
    
    // Set agents when building
    setActiveAgents({
      chat: 1000000,
      coding: 5000000,
      preview: 1000000,
      publish: 3000000,
    });
  }, []);

  const stopBuilding = useCallback(() => {
    setIsBuilding(false);
    setBuildProgress(100);
    setBuildStartTime(null);
  }, []);

  useEffect(() => {
    if (!isBuilding || buildStartTime === null) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - buildStartTime;
      const progress = Math.min((elapsed / BUILD_DURATION) * 100, 100);
      
      setBuildProgress(progress);
      
      // Simulate agent activity fluctuations
      setActiveAgents((prev) => ({
        chat: Math.max(900000, Math.min(1100000, prev.chat + Math.floor(Math.random() * 50000) - 25000)),
        coding: Math.max(4500000, Math.min(5500000, prev.coding + Math.floor(Math.random() * 100000) - 50000)),
        preview: Math.max(900000, Math.min(1100000, prev.preview + Math.floor(Math.random() * 50000) - 25000)),
        publish: Math.max(2500000, Math.min(3500000, prev.publish + Math.floor(Math.random() * 100000) - 50000)),
      }));

      if (progress >= 100) {
        stopBuilding();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBuilding, buildStartTime, stopBuilding]);

  return {
    isBuilding,
    buildProgress,
    activeAgents,
    startBuilding,
    stopBuilding,
  };
};
