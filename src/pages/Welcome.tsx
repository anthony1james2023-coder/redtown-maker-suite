import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, Home, Flame, Bug } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyStreak } from "@/hooks/useDailyStreak";
import MouseParticles from "@/components/builder/MouseParticles";
import ExtraDecorations from "@/components/builder/ExtraDecorations";

const matrixColumns = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i / 20) * 100}%`,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 12,
  chars: Array.from({ length: 12 + Math.floor(Math.random() * 8) }, () =>
    String.fromCharCode(0x30A0 + Math.random() * 96)
  ).join("\n"),
  opacity: 0.03 + Math.random() * 0.04,
  fontSize: 10 + Math.random() * 4,
}));

const floatingParticles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 6,
}));

const hexDots = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: Math.random() * 5,
  size: 1 + Math.random() * 2,
}));

const Welcome = () => {
  const { user, loading } = useAuth();
  const { streak, loading: streakLoading } = useDailyStreak();
  const isReturning = !loading && !!user;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <MouseParticles />
      <ExtraDecorations />

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-destructive/5 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-[60%] left-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[140px] animate-[pulse_12s_ease-in-out_infinite_4s]" />
      </div>

      {/* Matrix rain */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {matrixColumns.map((col) => (
          <div
            key={col.id}
            className="absolute top-0 font-mono text-primary whitespace-pre leading-tight"
            style={{
              left: col.left,
              fontSize: col.fontSize,
              opacity: col.opacity,
              animation: `matrix-fall ${col.duration}s linear infinite`,
              animationDelay: `${col.delay}s`,
            }}
          >
            {col.chars}
          </div>
        ))}
      </div>

      {/* Hex grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="welcome-hexgrid" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
              <path d="M28 2L54 18V50L28 66L2 50V18Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              <path d="M28 34L54 50V82L28 98L2 82V50Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#welcome-hexgrid)" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary/20"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animation: `float-particle ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Hex blinking dots */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {hexDots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-primary"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              animation: `hex-blink 3s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Diagonal scan lines */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, hsl(var(--primary)) 4px, hsl(var(--primary)) 5px)`,
        }}
      />

      {/* Horizontal scan line */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/15 to-transparent"
          style={{ animation: "scanline-move 6s linear infinite" }}
        />
      </div>

      {/* Vertical scan line */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary/10 to-transparent"
          style={{ animation: "scanline-move-h 8s linear infinite" }}
        />
      </div>

      {/* Radar rings */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" style={{ animation: "radar-ping 6s ease-out infinite" }} />
        <div className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" style={{ animation: "radar-ping 6s ease-out infinite 2s" }} />
        <div className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" style={{ animation: "radar-ping 6s ease-out infinite 4s" }} />
      </div>

      {/* Circuit traces */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="25%" x2="35%" y2="25%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="35%" y1="25%" x2="35%" y2="45%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <circle cx="35%" cy="25%" r="3" fill="hsl(var(--primary))" opacity="0.5" />
          <line x1="65%" y1="55%" x2="90%" y2="55%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="65%" y1="55%" x2="65%" y2="75%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <circle cx="65%" cy="55%" r="3" fill="hsl(var(--primary))" opacity="0.5" />
        </svg>
      </div>

      {/* Side data streams */}
      <div className="fixed left-0 top-0 bottom-0 w-8 pointer-events-none z-[1] flex flex-col items-center justify-center gap-1 opacity-[0.06]">
        {Array.from({ length: 25 }, (_, i) => (
          <div key={i} className="w-1 bg-primary rounded-full" style={{ height: 2 + Math.random() * 12, animation: `data-stream 2s ease-in-out infinite ${i * 0.15}s` }} />
        ))}
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-8 pointer-events-none z-[1] flex flex-col items-center justify-center gap-1 opacity-[0.06]">
        {Array.from({ length: 25 }, (_, i) => (
          <div key={i} className="w-1 bg-primary rounded-full" style={{ height: 2 + Math.random() * 12, animation: `data-stream 2s ease-in-out infinite ${i * 0.1}s` }} />
        ))}
      </div>

      {/* Corner brackets */}
      <div className="fixed top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/10 pointer-events-none z-[1]" />
      <div className="fixed top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/10 pointer-events-none z-[1]" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/10 pointer-events-none z-[1]" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/10 pointer-events-none z-[1]" />

      {/* HUD crosshair */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.04]">
        <div className="w-16 h-[1px] bg-primary absolute top-1/2 -left-8" />
        <div className="h-16 w-[1px] bg-primary absolute left-1/2 -top-8" />
        <div className="w-6 h-6 border border-primary/40 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Glitch flicker */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ animation: "glitch-flicker 8s step-end infinite" }}>
        <div className="w-full h-full bg-primary/[0.01]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono tracking-widest uppercase">
          <Rocket className="h-4 w-4" />
          {isReturning ? "Welcome Back" : "Welcome"}
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-foreground">
          {isReturning ? "Welcome back to" : "Welcome to"}{" "}
          <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            Redtown 2
          </span>
        </h1>

        {isReturning && !streakLoading && streak > 0 && (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive">
            <Flame className="h-5 w-5" />
            <span className="text-lg font-bold">{streak} day{streak !== 1 ? "s" : ""} streak</span>
            <Flame className="h-5 w-5" />
          </div>
        )}

        <p className="text-lg text-muted-foreground leading-relaxed">
          Create apps with ease. Build something amazing today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="hero" size="xl">
            <Link to="/tutorial">
              <BookOpen className="h-5 w-5 mr-2" />
              See Tutorial
            </Link>
          </Button>

          <Button asChild variant="hero-outline" size="lg">
            <Link to="/home">
              <Home className="h-4 w-4 mr-2" />
              Go to Home Page to Get Started
            </Link>
          </Button>
        </div>

        <div className="fixed left-4 bottom-6 z-50">
          <Button asChild variant="outline" size="lg" className="rounded-full border-destructive/40 bg-background/80 backdrop-blur-sm shadow-lg hover:border-destructive hover:bg-destructive/10 gap-2">
            <Link to="/agent-mistakes">
              <Bug className="h-5 w-5 text-destructive" />
              <span className="text-sm font-semibold">Agent Mistakes</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Status ticker */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-[1] overflow-hidden h-6 bg-background/50 backdrop-blur-sm border-t border-primary/10">
        <div className="flex items-center h-full" style={{ animation: "ticker 30s linear infinite" }}>
          <span className="text-[10px] font-mono text-primary/30 whitespace-nowrap tracking-widest">
            ◆ SYSTEMS ONLINE ◆ REDTOWN 2 ACTIVE ◆ ∞ AI CORES RUNNING ◆ BUILD ENGINE READY ◆ NEURAL NETWORK SYNC ◆ QUANTUM MESH STABLE ◆ CYBERDECK LOADED ◆ FIREWALL ACTIVE ◆ ENCRYPTION: AES-256 ◆ UPLINK: 99.99% ◆ SYSTEMS ONLINE ◆ REDTOWN 2 ACTIVE ◆ ∞ AI CORES RUNNING ◆ BUILD ENGINE READY ◆ NEURAL NETWORK SYNC ◆ QUANTUM MESH STABLE ◆ CYBERDECK LOADED ◆ FIREWALL ACTIVE ◆ ENCRYPTION: AES-256 ◆ UPLINK: 99.99% ◆
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-25px) translateX(15px); opacity: 0.6; }
        }
        @keyframes scanline-move {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes scanline-move-h {
          0% { left: -2px; }
          100% { left: 100%; }
        }
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes hex-blink {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.15; }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes radar-ping {
          0% { transform: scale(0); opacity: 0.15; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes glitch-flicker {
          0%, 90%, 100% { opacity: 0; }
          91% { opacity: 1; }
          93% { opacity: 0; }
          95% { opacity: 0.5; }
        }
        @keyframes data-stream {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(2); }
        }
      `}</style>
    </div>
  );
};

export default Welcome;
