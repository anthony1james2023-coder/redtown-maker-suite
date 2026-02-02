import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Code2, Rocket } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating Elements */}
      <div className="absolute top-32 left-20 animate-float opacity-60" style={{ animationDelay: '0s' }}>
        <Code2 className="w-8 h-8 text-red-500" />
      </div>
      <div className="absolute top-48 right-32 animate-float opacity-60" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-6 h-6 text-orange-400" />
      </div>
      <div className="absolute bottom-40 left-32 animate-float opacity-60" style={{ animationDelay: '4s' }}>
        <Rocket className="w-7 h-7 text-red-400" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">More powerful than Replit & GitHub combined</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Build{" "}
            <span className="gradient-text glow-text">Unlimited</span>
            <br />
            Apps with AI
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The ultimate AI-powered platform to create, publish, and host apps. 
            From browser games to mobile apps — deploy straight to App Store & Play Store.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" className="group">
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="xl" className="group">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { value: "10M+", label: "Apps Created" },
              { value: "500K+", label: "Developers" },
              { value: "99.9%", label: "Uptime" },
              { value: "∞", label: "Possibilities" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Code Preview */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card glow-effect max-w-2xl mx-auto overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-surface-elevated/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
              </div>
              <div className="p-6 text-left font-mono text-sm">
                <div className="text-muted-foreground">
                  <span className="text-terminal-green">$</span> redtown create my-app
                </div>
                <div className="text-muted-foreground mt-2">
                  <span className="text-terminal-green">✓</span> Initializing AI assistant...
                </div>
                <div className="text-muted-foreground mt-1">
                  <span className="text-terminal-green">✓</span> Setting up project structure...
                </div>
                <div className="text-muted-foreground mt-1">
                  <span className="text-terminal-green">✓</span> Configuring deployment pipeline...
                </div>
                <div className="mt-3">
                  <span className="text-red-400">→</span> Your app is ready at{" "}
                  <span className="text-red-400 underline">my-app.redtown.dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
