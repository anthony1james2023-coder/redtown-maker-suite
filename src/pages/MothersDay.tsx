import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowLeft } from "lucide-react";
import FunFactsSection from "@/components/FunFactsSection";

const petals = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 6,
  size: 10 + Math.random() * 16,
  rotation: Math.random() * 360,
}));

const MothersDay = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-950 via-rose-950 to-background relative overflow-hidden flex flex-col items-center justify-center">
      {/* Falling petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none z-[1]"
          style={{
            left: p.left,
            top: "-5%",
            width: p.size,
            height: p.size,
            opacity: 0.5,
            borderRadius: "50% 0 50% 50%",
            background: `linear-gradient(135deg, hsl(340 80% 65%), hsl(350 90% 75%))`,
            animation: `petal-fall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div
        className={`relative z-10 text-center px-6 max-w-2xl transition-all duration-1000 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Animated heart */}
        <div className="mx-auto mb-8 relative w-24 h-24">
          <Heart
            className="w-24 h-24 text-pink-400 fill-pink-400 drop-shadow-[0_0_30px_rgba(244,114,182,0.5)]"
            style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}
          />
          <Sparkles
            className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300"
            style={{ animation: "sparkle-spin 3s linear infinite" }}
          />
          <Sparkles
            className="absolute -bottom-1 -left-3 w-6 h-6 text-pink-300"
            style={{ animation: "sparkle-spin 4s linear infinite reverse" }}
          />
        </div>

        <h1 className="text-5xl sm:text-7xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Happy Mother's
          </span>
          <br />
          <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-red-400 bg-clip-text text-transparent">
            Day! 💐
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-pink-200/80 mb-3 font-medium">
          To the most amazing person in the world
        </p>
        <p className="text-sm text-pink-300/50 mb-8 max-w-md mx-auto">
          We upgraded the Redtown 2 Builder with love and flowers just for today 🌸✨
          Because every masterpiece starts with a mother's love 💕
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link to="/builder">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-xl shadow-pink-500/30 border-0 text-base px-8"
            >
              <Sparkles className="w-5 h-5" />
              Open Builder 🌷
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="lg" className="gap-2 text-pink-300 hover:text-pink-200 hover:bg-pink-500/10">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Decorative hearts */}
        <div className="mt-12 flex justify-center gap-2 text-pink-400/30 text-2xl">
          {"💖💗💓💕💖💗💓💕💖".split("").map((e, i) => (
            <span
              key={i}
              style={{
                animation: "float 3s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      <FunFactsSection />

      {/* Inline keyframes */}
      <style>{`
        @keyframes petal-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.1); }
        }
        @keyframes sparkle-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MothersDay;
