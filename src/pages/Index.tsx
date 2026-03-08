import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import GamesGallery from "@/components/GamesGallery";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 6,
}));

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-destructive/5 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[140px] animate-[pulse_12s_ease-in-out_infinite_4s]" />
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

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scan line */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/15 to-transparent"
          style={{ animation: "scanline-move 6s linear infinite" }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />

          {/* Special Events Section */}
          <div className="relative py-16">
            {/* Section decorative line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <p className="text-center text-sm font-mono tracking-[0.3em] uppercase text-muted-foreground mb-8 animate-fade-in">
              ✦ Special Events ✦
            </p>

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

          <FeaturesSection />
          <GamesGallery />
          <PricingSection />
          <CTASection />
        </main>
        <Footer />
      </div>

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
      `}</style>
    </div>
  );
};

export default Index;
