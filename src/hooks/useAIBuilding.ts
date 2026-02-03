import { useState, useEffect, useCallback } from "react";

type AgentType = "chat" | "coding" | "preview" | "publish";

const DEFAULT_AGENTS: Record<AgentType, number> = {
  chat: 10,
  coding: 50,
  preview: 10,
  publish: 30,
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
    
    // Increase coding agents when building
    setActiveAgents({
      chat: 10,
      coding: 50,
      preview: 10,
      publish: 30,
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
        chat: Math.max(8, Math.min(12, prev.chat + Math.floor(Math.random() * 3) - 1)),
        coding: Math.max(45, Math.min(55, prev.coding + Math.floor(Math.random() * 5) - 2)),
        preview: Math.max(8, Math.min(12, prev.preview + Math.floor(Math.random() * 3) - 1)),
        publish: Math.max(25, Math.min(35, prev.publish + Math.floor(Math.random() * 5) - 2)),
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
