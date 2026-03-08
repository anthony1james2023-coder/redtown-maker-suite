import { useState, useEffect } from "react";

const ElectricArc = ({ x1, y1, x2, y2, delay }: { x1: string; y1: string; x2: string; y2: string; delay: number }) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    style={{ opacity: 0.15 }}
  >
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="hsl(var(--primary))"
      strokeWidth="1"
      strokeDasharray="4 8"
      style={{
        animation: `electricPulse 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  </svg>
);

const PulsingRadar = () => (
  <div className="absolute top-1/4 right-[10%] pointer-events-none z-[1] opacity-[0.06]">
    <div className="relative w-40 h-40">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-primary"
          style={{
            animation: "radarPing 4s ease-out infinite",
            animationDelay: `${i * 1.3}s`,
          }}
        />
      ))}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
    </div>
  </div>
);

const FloatingCodeSnippets = () => {
  const snippets = [
    "const ai = new Engine();",
    "await build(project);",
    "render(<App />);",
    "export default Game;",
    "npm run deploy",
    "git push origin main",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {snippets.map((code, i) => (
        <div
          key={i}
          className="absolute text-[9px] font-mono text-primary/[0.07] whitespace-nowrap"
          style={{
            left: `${10 + (i * 15) % 80}%`,
            top: `${15 + (i * 20) % 70}%`,
            animation: `floatCode ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
          }}
        >
          {code}
        </div>
      ))}
    </div>
  );
};

const GlowingNodes = () => {
  const nodes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: `${12 + (i * 17) % 80}%`,
    y: `${10 + (i * 23) % 75}%`,
    size: 3 + (i % 3),
    delay: i * 0.8,
  }));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-[0.12]">
      {/* Connection lines between nodes */}
      {nodes.map((node, i) =>
        nodes.slice(i + 1, i + 3).map((target, j) => (
          <line
            key={`${i}-${j}`}
            x1={node.x} y1={node.y}
            x2={target.x} y2={target.y}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            strokeDasharray="2 6"
            opacity="0.3"
          />
        ))
      )}
      {/* Glowing dots */}
      {nodes.map((node) => (
        <circle
          key={node.id}
          cx={node.x} cy={node.y}
          r={node.size}
          fill="hsl(var(--primary))"
          style={{
            animation: `nodePulse 3s ease-in-out infinite`,
            animationDelay: `${node.delay}s`,
          }}
        />
      ))}
    </svg>
  );
};

const DataStream = () => (
  <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none z-[1] overflow-hidden opacity-20">
    <div
      className="w-full bg-gradient-to-b from-transparent via-primary to-transparent"
      style={{
        height: "30%",
        animation: "dataStream 5s linear infinite",
      }}
    />
  </div>
);

const ExtraDecorations = () => (
  <>
    <PulsingRadar />
    <FloatingCodeSnippets />
    <GlowingNodes />
    <DataStream />
    <ElectricArc x1="5%" y1="30%" x2="25%" y2="15%" delay={0} />
    <ElectricArc x1="75%" y1="80%" x2="95%" y2="65%" delay={1.5} />

    {/* Inject keyframes */}
    <style>{`
      @keyframes radarPing {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
      }
      @keyframes floatCode {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.07; }
        25% { transform: translateY(-12px) translateX(6px); opacity: 0.12; }
        50% { transform: translateY(-6px) translateX(-4px); opacity: 0.05; }
        75% { transform: translateY(8px) translateX(8px); opacity: 0.1; }
      }
      @keyframes nodePulse {
        0%, 100% { opacity: 0.3; r: inherit; }
        50% { opacity: 1; }
      }
      @keyframes dataStream {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(400%); }
      }
      @keyframes electricPulse {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `}</style>
  </>
);

export default ExtraDecorations;
