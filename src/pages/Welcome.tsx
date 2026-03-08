import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Welcome = () => {
  const { user, loading } = useAuth();
  const isReturning = !loading && !!user;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-destructive/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono tracking-widest uppercase">
          <Rocket className="h-4 w-4" />
          Welcome
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-foreground">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            Redtown 2
          </span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Create apps with ease. Build something amazing today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="hero" size="xl">
            <Link to="/builder">
              <Rocket className="h-5 w-5 mr-2" />
              Create Your First App
            </Link>
          </Button>

          <Button asChild variant="hero-outline" size="lg">
            <Link to="/home">
              <Home className="h-4 w-4 mr-2" />
              Go to Home Page to Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
