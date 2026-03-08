import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "star" | "diamond";
}

const COLORS = [
  "hsl(0, 72%, 51%)",    // primary red
  "hsl(350, 80%, 45%)",  // dark red
  "hsl(30, 100%, 60%)",  // orange
  "hsl(50, 100%, 60%)",  // gold
  "hsl(270, 70%, 55%)",  // violet
  "hsl(200, 80%, 55%)",  // cyan
  "hsl(142, 70%, 50%)",  // green
  "hsl(330, 70%, 55%)",  // pink
];

const ParticleExplosion = ({ active, onComplete }: { active: boolean; onComplete?: () => void }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createExplosion = useCallback(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const newParticles: Particle[] = [];

    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 8;
      const life = 60 + Math.random() * 60;
      newParticles.push({
        id: i,
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life,
        maxLife: life,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        shape: (["circle", "star", "diamond"] as const)[Math.floor(Math.random() * 3)],
      });
    }

    // Secondary burst (smaller particles)
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      const life = 40 + Math.random() * 40;
      newParticles.push({
        id: 80 + i,
        x: cx + (Math.random() - 0.5) * 100,
        y: cy + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life,
        maxLife: life,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        shape: "circle",
      });
    }

    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (active) createExplosion();
  }, [active, createExplosion]);

  useEffect(() => {
    if (particles.length === 0) return;

    const frame = requestAnimationFrame(() => {
      setParticles((prev) => {
        const next = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            vx: p.vx * 0.98, // friction
            life: p.life - 1,
            rotation: p.rotation + p.rotationSpeed,
            size: p.size * (p.life / p.maxLife > 0.3 ? 1 : 0.96),
          }))
          .filter((p) => p.life > 0);

        if (next.length === 0) onComplete?.();
        return next;
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [particles, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Flash overlay */}
      {particles.length > 100 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, hsl(0 72% 51% / 0.15), transparent 60%)`,
          }}
        />
      )}
      {particles.map((p) => {
        const opacity = Math.min(1, p.life / p.maxLife * 2);
        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              opacity,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              background:
                p.shape === "circle"
                  ? `radial-gradient(circle, ${p.color}, transparent)`
                  : p.color,
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "diamond" ? "2px" : "0",
              clipPath:
                p.shape === "star"
                  ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                  : p.shape === "diamond"
                  ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                  : undefined,
              boxShadow: `0 0 ${p.size}px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleExplosion;
