import { useState, useEffect, useCallback } from "react";

type AgentType = "chat" | "coding" | "preview" | "publish";

// Use Infinity for unlimited AIs
const DEFAULT_AGENTS: Record<AgentType, number> = {
  chat: Infinity,
  coding: Infinity,
  preview: Infinity,
  publish: Infinity,
};

const BUILD_DURATION = 10 * 1000; // 10 seconds - ULTRA FAST with infinite AIs!

export const useAIBuilding = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [activeAgents, setActiveAgents] = useState<Record<AgentType, number>>(DEFAULT_AGENTS);
  const [buildStartTime, setBuildStartTime] = useState<number | null>(null);

  const startBuilding = useCallback(() => {
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildStartTime(Date.now());
    
    // Infinite AIs activated!
    setActiveAgents(DEFAULT_AGENTS);
  }, []);

  const stopBuilding = useCallback(() => {
    setIsBuilding(false);
    setBuildProgress(100);
    setBuildStartTime(null);
  }, []);

  useEffect(() => {
    if (!isBuilding || buildStartTime === null) return;

    // Update every 100ms for smooth ultra-fast progress
    const interval = setInterval(() => {
      const elapsed = Date.now() - buildStartTime;
      const progress = Math.min((elapsed / BUILD_DURATION) * 100, 100);
      
      setBuildProgress(progress);
      
      // Keep infinite AIs - they never fluctuate because infinity is infinite!
      setActiveAgents(DEFAULT_AGENTS);

      if (progress >= 100) {
        stopBuilding();
      }
    }, 100);

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
