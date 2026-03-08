import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-destructive/10 rounded-full blur-[150px] animate-pulse" />
      </div>

      {/* Scan lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 3px)" }}
      />

      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-lg">
          {/* Glitch 404 */}
          <div className="relative mb-6">
            <h1 className="text-[120px] md:text-[160px] font-black leading-none text-primary/10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-destructive animate-pulse" />
            </div>
          </div>

          {/* Error message */}
          <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 mb-8">
            <div className="font-mono text-sm text-destructive mb-3 tracking-wider">
              ⚠ ERROR: PAGE NOT FOUND
            </div>
            <h2 className="text-2xl font-bold mb-3">
              Wrong Page!
            </h2>
            <p className="text-muted-foreground mb-4">
              The page <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{location.pathname}</span> is not created yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Please enter a real page to continue browsing.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="hero" size="lg" className="gap-2">
              <Link to="/home">
                <Home className="w-4 h-4" /> Go to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
              <span className="cursor-pointer" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" /> Go Back
              </span>
            </Button>
          </div>

          {/* Available pages hint */}
          <div className="mt-10 text-xs text-muted-foreground/60 font-mono">
            <p className="mb-2">Available pages:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["/home", "/builder", "/marketplace", "/blog", "/tutorials", "/docs", "/gallery", "/about", "/owner", "/community", "/features", "/pricing"].map(p => (
                <Link key={p} to={p} className="px-2 py-1 rounded bg-primary/5 border border-primary/10 hover:border-primary/30 hover:text-primary transition-colors">
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
