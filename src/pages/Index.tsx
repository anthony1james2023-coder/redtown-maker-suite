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

      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />

          {/* Special Events Section */}
          <div className="relative py-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Glitch-style section label */}
            <div className="text-center mb-8">
              <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 animate-fade-in relative inline-block">
                <span className="absolute -left-6 text-primary/30">[ </span>
                ✦ Special Events ✦
                <span className="absolute -right-6 text-primary/30"> ]</span>
              </p>
              <div className="mt-2 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            <div className="flex justify-center gap-6 flex-wrap px-4">
              <Button
                asChild
                size="lg"
                className="relative group bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white text-lg px-10 py-6 rounded-2xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 border-0"
              >
                <Link to="/mothers-day">
                  <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                  🌸 Mother's Day Special
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="relative group bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white text-lg px-10 py-6 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border-0"
              >
                <Link to="/fathers-day">
                  <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                  🏀 Father's Day Special
                </Link>
              </Button>
            </div>
          </div>

          {/* All Pages Directory */}
          <div className="relative py-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="text-center mb-8">
              <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 relative inline-block">
                <span className="absolute -left-6 text-primary/30">[ </span>
                ✦ Explore All Pages ✦
                <span className="absolute -right-6 text-primary/30"> ]</span>
              </p>
              <div className="mt-2 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>
            <div className="flex justify-center gap-3 flex-wrap px-4 max-w-4xl mx-auto">
              {[
                { to: "/blog", label: "📝 Blog", gradient: "from-blue-600 to-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40" },
                { to: "/tutorials", label: "📚 Tutorials", gradient: "from-green-600 to-green-500 shadow-green-500/20 hover:shadow-green-500/40" },
                { to: "/docs", label: "📖 Documentation", gradient: "from-purple-600 to-purple-500 shadow-purple-500/20 hover:shadow-purple-500/40" },
                { to: "/gallery", label: "🎮 Gallery", gradient: "from-orange-600 to-orange-500 shadow-orange-500/20 hover:shadow-orange-500/40" },
                { to: "/community", label: "💬 Community", gradient: "from-pink-600 to-pink-500 shadow-pink-500/20 hover:shadow-pink-500/40" },
                { to: "/about", label: "👥 About Us", gradient: "from-teal-600 to-teal-500 shadow-teal-500/20 hover:shadow-teal-500/40" },
                { to: "/owner", label: "👑 Owner", gradient: "from-amber-600 to-amber-500 shadow-amber-500/20 hover:shadow-amber-500/40" },
                { to: "/careers", label: "💼 Careers", gradient: "from-sky-600 to-sky-500 shadow-sky-500/20 hover:shadow-sky-500/40" },
                { to: "/contact", label: "✉️ Contact", gradient: "from-lime-600 to-lime-500 shadow-lime-500/20 hover:shadow-lime-500/40" },
                { to: "/press", label: "📰 Press", gradient: "from-fuchsia-600 to-fuchsia-500 shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40" },
                { to: "/features", label: "⚡ Features", gradient: "from-cyan-600 to-cyan-500 shadow-cyan-500/20 hover:shadow-cyan-500/40" },
                { to: "/pricing", label: "💰 Pricing", gradient: "from-emerald-600 to-emerald-500 shadow-emerald-500/20 hover:shadow-emerald-500/40" },
                { to: "/marketplace", label: "🏪 Marketplace", gradient: "from-indigo-600 to-indigo-500 shadow-indigo-500/20 hover:shadow-indigo-500/40" },
                { to: "/changelog", label: "📋 Changelog", gradient: "from-rose-600 to-rose-500 shadow-rose-500/20 hover:shadow-rose-500/40" },
                { to: "/roadmap", label: "🗺️ Roadmap", gradient: "from-violet-600 to-violet-500 shadow-violet-500/20 hover:shadow-violet-500/40" },
                { to: "/privacy", label: "🔒 Privacy", gradient: "from-gray-600 to-gray-500 shadow-gray-500/20 hover:shadow-gray-500/40" },
                { to: "/terms", label: "📄 Terms", gradient: "from-stone-600 to-stone-500 shadow-stone-500/20 hover:shadow-stone-500/40" },
                { to: "/security", label: "🛡️ Security", gradient: "from-red-600 to-red-500 shadow-red-500/20 hover:shadow-red-500/40" },
                { to: "/credits", label: "🎬 Credits", gradient: "from-yellow-600 to-yellow-500 shadow-yellow-500/20 hover:shadow-yellow-500/40" },
              ].map((page) => (
                <Button
                  key={page.to}
                  asChild
                  className={`bg-gradient-to-r ${page.gradient} text-white hover:scale-105 transition-all duration-300 border-0 shadow-lg`}
                >
                  <Link to={page.to}>{page.label}</Link>
                </Button>
              ))}
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
      `}</style>
    </div>
  );
};

export default Index;
