import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ReplitLogo from "@/components/ReplitLogo";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Cpu,
  GitBranch,
  Share2,
  Terminal,
  Zap,
  Globe,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Build with AI",
    desc: "Describe your idea in plain English and watch it become a working app — no setup required.",
  },
  {
    icon: Terminal,
    title: "Code in the browser",
    desc: "A full editor, package manager, and shell. Start coding instantly from any device.",
  },
  {
    icon: Globe,
    title: "Deploy in one click",
    desc: "Ship to a live URL the moment you're ready. Hosting, scaling, and SSL handled for you.",
  },
  {
    icon: Users,
    title: "Collaborate live",
    desc: "Build together in real time, like a multiplayer document for your code.",
  },
  {
    icon: GitBranch,
    title: "Version control",
    desc: "Built-in history and Git so you never lose work and can roll back anytime.",
  },
  {
    icon: Cpu,
    title: "50+ languages",
    desc: "Python, JavaScript, Go, Rust, C++ and more — all preconfigured and ready to run.",
  },
];

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const start = () => navigate(user ? "/~" : "/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/">
            <ReplitLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Product</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#cta" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button onClick={() => navigate("/~")} size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate("/login")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/15 rounded-full blur-[150px]" />
          <div className="absolute top-1/3 right-[10%] w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface-elevated text-xs text-muted-foreground mb-6">
            <Zap className="h-3.5 w-3.5 text-brand-orange" />
            The fastest way to build software
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Turn your ideas into
            <br />
            <span className="bg-gradient-to-r from-brand-orange to-primary bg-clip-text text-transparent">
              apps & websites
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Replit is the AI-powered workspace where anyone can build, ship, and
            share software — right from the browser. No installs, no setup.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
            <Button size="lg" onClick={start} className="gap-2 text-base h-12 px-7">
              Start building free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base h-12 px-7"
            >
              See features
            </Button>
          </div>

          {/* Editor mockup */}
          <div className="mt-16 rounded-xl border border-border bg-surface-elevated shadow-2xl shadow-primary/10 overflow-hidden text-left">
            <div className="flex items-center gap-1.5 px-4 h-10 border-b border-border bg-card">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-brand-orange/70" />
              <span className="h-3 w-3 rounded-full bg-terminal-green/70" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">main.py — Replit</span>
            </div>
            <div className="grid md:grid-cols-2 font-mono text-sm">
              <pre className="p-5 text-muted-foreground overflow-x-auto leading-relaxed bg-[hsl(var(--code-bg))]">
{`from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, world!"

app.run(host="0.0.0.0")`}
              </pre>
              <div className="p-5 border-t md:border-t-0 md:border-l border-border bg-card flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2 text-terminal-green">
                  <Terminal className="h-3.5 w-3.5" /> Running on 0.0.0.0:8080
                </div>
                <div className="text-muted-foreground">→ Build complete in 0.4s</div>
                <div className="text-muted-foreground">→ Deployed to your-app.replit.app</div>
                <div className="mt-auto flex items-center gap-2 text-primary">
                  <Code2 className="h-3.5 w-3.5" /> Live preview ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Everything you need to build
        </h2>
        <p className="text-muted-foreground text-center mt-3 max-w-xl mx-auto">
          From your first line of code to a deployed product — all in one place.
        </p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-surface-elevated p-6 hover:border-primary/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="max-w-4xl mx-auto px-5 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-elevated to-card p-10 sm:p-14 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/15 rounded-full blur-[120px]" />
          </div>
          <div className="relative">
            <Share2 className="h-8 w-8 text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold">Start building today</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Join millions of creators turning ideas into reality. It's free to start.
            </p>
            <Button size="lg" onClick={start} className="mt-8 gap-2 h-12 px-8 text-base">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <ReplitLogo />
          <span>Built on Lovable Cloud · A Replit-style workspace</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
