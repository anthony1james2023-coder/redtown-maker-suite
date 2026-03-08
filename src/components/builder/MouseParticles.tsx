import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}

const MouseParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("mouseParticlesEnabled");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("mouseParticlesEnabled", String(enabled));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Spawn particles on movement
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 3,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.6,
          hue: 0 + Math.random() * 30, // red-orange range
        });
      }
      // Cap particles
      if (particlesRef.current.length > 150) {
        particlesRef.current = particlesRef.current.slice(-150);
      }
    };

    window.addEventListener("mousemove", onMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dt = 1 / 60;

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= dt / p.maxLife;
        if (p.life <= 0) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // tiny gravity
        p.vx *= 0.99;

        const alpha = p.life * 0.6;
        const size = p.size * p.life;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 55%, ${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 55%, ${alpha * 0.2})`;
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [enabled]);

  return (
    <>
      {enabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[3]"
          style={{ mixBlendMode: "screen" }}
        />
      )}
      <button
        onClick={() => setEnabled((v) => !v)}
        className="fixed bottom-8 right-4 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all duration-300"
        style={{
          background: enabled
            ? "hsl(var(--primary) / 0.15)"
            : "hsl(var(--secondary) / 0.5)",
          borderColor: enabled
            ? "hsl(var(--primary) / 0.4)"
            : "hsl(var(--border) / 0.4)",
          color: enabled
            ? "hsl(var(--primary))"
            : "hsl(var(--muted-foreground))",
          backdropFilter: "blur(8px)",
        }}
        title={enabled ? "Hide particles" : "Show particles"}
      >
        <span>{enabled ? "✨" : "💤"}</span>
        <span>{enabled ? "Particles ON" : "Particles OFF"}</span>
      </button>
    </>
  );
};

export default MouseParticles;
