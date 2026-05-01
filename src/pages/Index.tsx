import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import GamesGallery from "@/components/GamesGallery";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import FunFactsSection from "@/components/FunFactsSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import MouseParticles from "@/components/builder/MouseParticles";

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 6,
}));

const matrixColumns = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i / 25) * 100}%`,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 12,
  chars: Array.from({ length: 15 + Math.floor(Math.random() * 10) }, () =>
    String.fromCharCode(0x30A0 + Math.random() * 96)
  ).join("\n"),
  opacity: 0.03 + Math.random() * 0.05,
  fontSize: 10 + Math.random() * 4,
}));

const hexDots = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: Math.random() * 5,
  size: 1 + Math.random() * 2,
}));

const Index = () => {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating profile circle */}
      <Link
        to={user ? "/profile" : "/login"}
        className="fixed top-20 right-4 z-50 group"
        title={user ? "Go to Profile" : "Sign In"}
      >
        <div className="h-12 w-12 rounded-full border-2 border-primary/50 bg-card/80 backdrop-blur shadow-lg shadow-primary/20 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-primary group-hover:shadow-primary/40">
          {user ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                {displayName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
      </Link>
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-destructive/5 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[140px] animate-[pulse_12s_ease-in-out_infinite_4s]" />
        <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] bg-primary/3 rounded-full blur-[100px] animate-[pulse_14s_ease-in-out_infinite_6s]" />
      </div>

      {/* Matrix rain columns */}
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
            <pattern id="hexgrid" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
              <path
                d="M28 2L54 18V50L28 66L2 50V18Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
              />
              <path
                d="M28 34L54 50V82L28 98L2 82V50Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexgrid)" />
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

      {/* Hex corner dots (blinking) */}
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
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 4px,
            hsl(var(--primary)) 4px,
            hsl(var(--primary)) 5px
          )`,
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

      {/* Status ticker */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-[1] overflow-hidden h-6 bg-background/50 backdrop-blur-sm border-t border-primary/10">
        <div className="flex items-center h-full" style={{ animation: "ticker 30s linear infinite" }}>
          <span className="text-[10px] font-mono text-primary/30 whitespace-nowrap tracking-widest">
            ◆ SYSTEMS ONLINE ◆ REDTOWN 2 ACTIVE ◆ ∞ AI CORES RUNNING ◆ BUILD ENGINE READY ◆ NEURAL NETWORK SYNC ◆ QUANTUM MESH STABLE ◆ CYBERDECK LOADED ◆ FIREWALL ACTIVE ◆ ENCRYPTION: AES-256 ◆ UPLINK: 99.99% ◆ SYSTEMS ONLINE ◆ REDTOWN 2 ACTIVE ◆ ∞ AI CORES RUNNING ◆ BUILD ENGINE READY ◆ NEURAL NETWORK SYNC ◆ QUANTUM MESH STABLE ◆ CYBERDECK LOADED ◆ FIREWALL ACTIVE ◆ ENCRYPTION: AES-256 ◆ UPLINK: 99.99% ◆
          </span>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="fixed top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/10 pointer-events-none z-[1]" />
      <div className="fixed top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/10 pointer-events-none z-[1]" />
      <div className="fixed bottom-10 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/10 pointer-events-none z-[1]" />
      <div className="fixed bottom-10 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/10 pointer-events-none z-[1]" />

      {/* Pulsing radar rings */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" style={{ animation: "radar-ping 6s ease-out infinite" }} />
        <div className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" style={{ animation: "radar-ping 6s ease-out infinite 2s" }} />
        <div className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" style={{ animation: "radar-ping 6s ease-out infinite 4s" }} />
      </div>

      {/* Circuit trace lines */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="20%" x2="30%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="30%" y1="20%" x2="30%" y2="40%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="30%" y1="40%" x2="50%" y2="40%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <circle cx="30%" cy="20%" r="3" fill="hsl(var(--primary))" opacity="0.5" />
          <circle cx="30%" cy="40%" r="3" fill="hsl(var(--primary))" opacity="0.5" />
          <line x1="70%" y1="60%" x2="90%" y2="60%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="70%" y1="60%" x2="70%" y2="80%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="50%" y1="80%" x2="70%" y2="80%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <circle cx="70%" cy="60%" r="3" fill="hsl(var(--primary))" opacity="0.5" />
          <circle cx="70%" cy="80%" r="3" fill="hsl(var(--primary))" opacity="0.5" />
          <line x1="60%" y1="10%" x2="80%" y2="10%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="80%" y1="10%" x2="80%" y2="30%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <circle cx="80%" cy="10%" r="3" fill="hsl(var(--primary))" opacity="0.5" />
        </svg>
      </div>

      {/* Glitch flicker overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ animation: "glitch-flicker 8s step-end infinite" }} >
        <div className="w-full h-full bg-primary/[0.01]" />
      </div>

      {/* Side data streams */}
      <div className="fixed left-0 top-0 bottom-0 w-8 pointer-events-none z-[1] flex flex-col items-center justify-center gap-1 opacity-[0.06]">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="w-1 bg-primary rounded-full" style={{ height: 2 + Math.random() * 12, animation: `data-stream 2s ease-in-out infinite ${i * 0.15}s` }} />
        ))}
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-8 pointer-events-none z-[1] flex flex-col items-center justify-center gap-1 opacity-[0.06]">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="w-1 bg-primary rounded-full" style={{ height: 2 + Math.random() * 12, animation: `data-stream 2s ease-in-out infinite ${i * 0.1}s` }} />
        ))}
      </div>

      {/* HUD crosshair center */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.04]">
        <div className="w-16 h-[1px] bg-primary absolute top-1/2 -left-8" />
        <div className="h-16 w-[1px] bg-primary absolute left-1/2 -top-8" />
        <div className="w-6 h-6 border border-primary/40 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />

          {/* Your History */}
          <div className="relative py-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="text-center mb-8">
              <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 animate-fade-in relative inline-block">
                <span className="absolute -left-6 text-primary/30">[ </span>
                ✦ Your Workspace ✦
                <span className="absolute -right-6 text-primary/30"> ]</span>
              </p>
              <div className="mt-2 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            <div className="flex justify-center px-4">
              <Button
                asChild
                size="lg"
                className="relative group bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-400 text-white text-lg px-10 py-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 border-0"
              >
                <Link to="/history">
                  <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-rose-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                  📜 See Your History
                </Link>
              </Button>
            </div>
          </div>

          <FeaturesSection />
          <GamesGallery />
          <PricingSection />


          <FunFactsSection />
          <CTASection />
        </main>
        <Footer />
      </div>

      <MouseParticles />

      {/* Inline keyframes */}
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

export default Index;
