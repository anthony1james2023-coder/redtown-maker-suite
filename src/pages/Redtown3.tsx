import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import { Zap, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Redtown3 = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/15 rounded-full blur-[180px]" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Icon */}
        <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 mb-8 shadow-2xl shadow-red-500/40 animate-pulse-glow">
          <Zap className="w-12 h-12 text-white" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
          <Clock className="w-4 h-4" />
          Coming Soon
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          Redtown <span className="gradient-text">3</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
          The next evolution is on its way. Faster, smarter, and more powerful than ever. Stay tuned for something incredible.
        </p>

        {/* CTA */}
        <Link to="/home">
          <Button variant="hero-outline" size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Redtown 2
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Redtown3;
