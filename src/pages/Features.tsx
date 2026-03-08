import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Cpu,
  Globe,
  Gamepad2,
  Smartphone,
  Cloud,
  Zap,
  Code2,
  Shield,
  Layers,
  Palette,
  Bot,
  GitBranch,
  Database,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FunFactsSection from "@/components/FunFactsSection";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Coding",
    description: "Latest AI models generate production-ready code. Build apps 10x faster with intelligent assistance that understands your intent.",
    gradient: "from-red-500 to-orange-500",
    details: ["GPT-5, Gemini 3, Claude support", "Context-aware suggestions", "Multi-file generation", "Real-time streaming"],
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    description: "Publish and host live apps instantly. Your projects go live in seconds with custom domains and SSL.",
    gradient: "from-orange-500 to-yellow-500",
    details: ["One-click deploy", "Custom domains", "SSL certificates", "Global CDN"],
  },
  {
    icon: Smartphone,
    title: "App Store Ready",
    description: "Deploy straight to the App Store and Play Store. Cross-platform mobile apps with zero config.",
    gradient: "from-red-600 to-red-400",
    details: ["iOS & Android", "PWA support", "Push notifications", "Offline mode"],
  },
  {
    icon: Gamepad2,
    title: "Browser Games",
    description: "Create and host browser games including Eaglercraft-style experiences. Full game engine support.",
    gradient: "from-red-500 to-pink-500",
    details: ["3D game engine", "Physics simulation", "Multiplayer support", "Asset management"],
  },
  {
    icon: Cloud,
    title: "Autonomous Builds",
    description: "Long autonomous builds run in the cloud. Set it and forget it — AI handles complex multi-step builds.",
    gradient: "from-orange-400 to-red-500",
    details: ["Background processing", "Build queue", "Auto-retry", "Progress tracking"],
  },
  {
    icon: Code2,
    title: "Extreme Coding",
    description: "More powerful than GitHub. Version control, collaboration, and deployment all in one place.",
    gradient: "from-red-400 to-orange-400",
    details: ["Git integration", "Live collaboration", "Code review", "Branch management"],
  },
  {
    icon: Shield,
    title: "Private Deployments",
    description: "Enterprise-grade security with private deployments. Your code stays yours with full encryption.",
    gradient: "from-red-500 to-red-700",
    details: ["End-to-end encryption", "SOC 2 compliant", "Audit logs", "IP whitelisting"],
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Optimized infrastructure for lightning-fast performance. Your apps load instantly worldwide.",
    gradient: "from-yellow-500 to-red-500",
    details: ["Edge computing", "Smart caching", "Code splitting", "Image optimization"],
  },
  {
    icon: Layers,
    title: "Multi-File Projects",
    description: "Organize complex projects with multi-file support. HTML, CSS, JS, and frameworks all work seamlessly.",
    gradient: "from-purple-500 to-red-500",
    details: ["File explorer", "Syntax highlighting", "Auto-imports", "Module bundling"],
  },
  {
    icon: Palette,
    title: "Image Generation",
    description: "Built-in AI image generation for creating assets, textures, icons, and artwork for your projects.",
    gradient: "from-pink-500 to-purple-500",
    details: ["Text-to-image", "Style transfer", "Asset library", "Batch generation"],
  },
  {
    icon: Bot,
    title: "∞ AI Agents",
    description: "Infinite AI agents work in parallel — coding, reviewing, testing, and deploying simultaneously.",
    gradient: "from-red-500 to-amber-500",
    details: ["Parallel processing", "Code review AI", "Test generation", "Auto-debugging"],
  },
  {
    icon: Database,
    title: "Built-in Backend",
    description: "Database, authentication, file storage, and serverless functions — all built in with zero setup.",
    gradient: "from-amber-500 to-red-600",
    details: ["PostgreSQL database", "Auth system", "File storage", "Edge functions"],
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 mb-4">[ CAPABILITIES ]</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Build Anything</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              From idea to production in minutes. Redtown 2 combines the power of infinite AI agents with enterprise-grade infrastructure.
            </p>
            <Link to="/builder">
              <Button variant="hero" size="lg" className="text-lg px-10">
                Start Building Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group glass-card p-8 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FunFactsSection />

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="glass-card max-w-2xl mx-auto p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
              <p className="text-muted-foreground mb-8">Join thousands of developers building with Redtown 2.</p>
              <Link to="/builder">
                <Button variant="hero" size="lg">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
