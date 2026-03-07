import { useEffect, useState } from "react";

const FloatingOrb = ({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) => (
  <div
    className="absolute rounded-full pointer-events-none animate-float"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      animationDelay: `${delay}s`,
      animationDuration: `${6 + delay}s`,
      opacity: 0.4,
      filter: `blur(${size / 3}px)`,
    }}
  />
);

const ScanLine = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
    <div
      className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      style={{
        animation: "scanline 8s linear infinite",
      }}
    />
  </div>
);

const MatrixRain = () => {
  const [columns] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i / 12) * 100}%`,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
      opacity: 0.03 + Math.random() * 0.05,
      chars: Array.from({ length: 8 }, () =>
        String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
      ).join("\n"),
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {columns.map((col) => (
        <pre
          key={col.id}
          className="absolute text-primary font-mono text-[10px] leading-tight whitespace-pre"
          style={{
            left: col.left,
            opacity: col.opacity,
            animation: `matrixfall ${col.duration}s linear infinite`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {col.chars}
        </pre>
      ))}
    </div>
  );
};

const GridOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-[1]">
    <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
    {/* Corner brackets */}
    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/20 rounded-tl-sm" />
    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/20 rounded-tr-sm" />
    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/20 rounded-bl-sm" />
    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-sm" />
  </div>
);

const HexGrid = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
        <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
        <path d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexagons)" />
  </svg>
);

const StatusTicker = () => {
  const items = [
    "⚡ SYSTEMS ONLINE",
    "🤖 ∞ AIs ACTIVE",
    "🔥 GPU CLUSTERS: 100%",
    "🧠 NEURAL NET: READY",
    "📡 STREAM: LIVE",
    "🛡️ SECURITY: MAX",
    "🚀 BUILD ENGINE: TURBO",
    "💎 QUALITY: ULTRA",
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden z-[2] border-t border-border/20 bg-background/60 backdrop-blur-sm">
      <div className="flex items-center h-full animate-ticker whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[10px] text-muted-foreground/60 font-mono mx-4 flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const BuilderDecorations = () => {
  return (
    <>
      {/* Floating orbs */}
      <FloatingOrb delay={0} size={120} x="5%" y="20%" color="hsl(var(--primary) / 0.15)" />
      <FloatingOrb delay={2} size={80} x="80%" y="10%" color="hsl(270 70% 50% / 0.1)" />
      <FloatingOrb delay={4} size={100} x="60%" y="70%" color="hsl(200 80% 50% / 0.08)" />
      <FloatingOrb delay={1} size={60} x="15%" y="80%" color="hsl(var(--primary) / 0.1)" />
      <FloatingOrb delay={3} size={90} x="90%" y="50%" color="hsl(330 70% 50% / 0.08)" />

      {/* Scan line */}
      <ScanLine />

      {/* Matrix rain */}
      <MatrixRain />

      {/* Grid overlay */}
      <GridOverlay />

      {/* Hex grid */}
      <HexGrid />

      {/* Status ticker */}
      <StatusTicker />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, hsl(var(--background)) 100%)",
        }}
      />
    </>
  );
};

export default BuilderDecorations;
