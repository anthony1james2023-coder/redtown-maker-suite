import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, ArrowLeft } from "lucide-react";
import FunFactsSection from "@/components/FunFactsSection";

const confetti = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 6,
  size: 10 + Math.random() * 16,
  rotation: Math.random() * 360,
}));

const FathersDay = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-indigo-950 to-background relative overflow-hidden flex flex-col items-center justify-center">
      {/* Falling stars */}
      {confetti.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none z-[1]"
          style={{
            left: p.left,
            top: "-5%",
            width: p.size,
            height: p.size,
            opacity: 0.5,
            borderRadius: "2px",
            background: `linear-gradient(135deg, hsl(210 80% 65%), hsl(40 90% 65%))`,
            animation: `star-fall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div
        className={`relative z-10 text-center px-6 max-w-2xl transition-all duration-1000 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Animated star */}
        <div className="mx-auto mb-8 relative w-24 h-24">
          <Star
            className="w-24 h-24 text-amber-400 fill-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]"
            style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}
          />
          <Sparkles
            className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300"
            style={{ animation: "sparkle-spin 3s linear infinite" }}
          />
          <Sparkles
            className="absolute -bottom-1 -left-3 w-6 h-6 text-blue-300"
            style={{ animation: "sparkle-spin 4s linear infinite reverse" }}
          />
        </div>

        <h1 className="text-5xl sm:text-7xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-blue-300 via-sky-300 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Happy Father's
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
            Day! 👔
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-blue-200/80 mb-3 font-medium">
          To the greatest hero in our lives
        </p>
        <p className="text-sm text-blue-300/50 mb-2 max-w-md mx-auto">
          Coming June 21 — we're preparing something special for all the amazing dads out there 🎉⭐
        </p>
        <p className="text-2xl font-bold text-amber-400/80 mb-8">
          🗓️ June 21, 2026
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link to="/fathers-builder">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/30 border-0 text-base px-8"
            >
              🏀 Father's Builder
            </Button>
          </Link>
          <Link to="/builder">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl shadow-blue-500/30 border-0 text-base px-8"
            >
              <Sparkles className="w-5 h-5" />
              Open Builder ⭐
            </Button>
          </Link>
          <Link to="/home">
            <Button variant="ghost" size="lg" className="gap-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/10">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Decorative */}
        <div className="mt-12 flex justify-center gap-2 text-blue-400/30 text-2xl">
          {"⭐🌟✨💫⭐🌟✨💫⭐".split("").map((e, i) => (
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
        @keyframes star-fall {
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

export default FathersDay;
