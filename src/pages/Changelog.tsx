import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Rocket, Bug, Sparkles, Wrench } from "lucide-react";

const changelog = [
  {
    version: "2.8.0",
    date: "March 7, 2026",
    type: "feature" as const,
    title: "Father's Day Builder",
    description: "Launched a special Father's Day themed builder with basketball branding and blue cyberpunk aesthetic.",
    items: ["New /fathers-builder page", "Basketball logo integration", "Blue theme with custom CSS variables"],
  },
  {
    version: "2.7.0",
    date: "March 6, 2026",
    title: "Mother's Day Special",
    type: "feature" as const,
    description: "Dedicated Mother's Day celebration page with falling petals animation and pink theme.",
    items: ["Animated petal effects", "Heart animations", "Special greeting page"],
  },
  {
    version: "2.6.0",
    date: "March 1, 2026",
    title: "Cyberpunk Home Redesign",
    type: "feature" as const,
    description: "Complete overhaul of the home page with matrix rain, hex grid, scan lines, and status ticker.",
    items: ["Matrix rain animation", "Hex grid SVG overlay", "Floating particles", "Status ticker bar"],
  },
  {
    version: "2.5.1",
    date: "February 20, 2026",
    title: "Image Generation Improvements",
    type: "improvement" as const,
    description: "Enhanced the built-in AI image generator with better prompt handling and faster generation.",
    items: ["Improved prompt parsing", "2x faster generation", "Better error handling"],
  },
  {
    version: "2.5.0",
    date: "February 15, 2026",
    title: "Multi-Model Support",
    type: "feature" as const,
    description: "Added support for GPT-5, Gemini 3 Flash, and more AI models in the builder.",
    items: ["Model selector UI", "GPT-5 integration", "Gemini 3 Flash Preview", "Streaming responses"],
  },
  {
    version: "2.4.0",
    date: "February 1, 2026",
    title: "File Explorer & Multi-File Projects",
    type: "feature" as const,
    description: "New file explorer sidebar for managing complex multi-file projects.",
    items: ["File tree view", "Multi-file parsing", "Combined preview", "Download as ZIP"],
  },
  {
    version: "2.3.2",
    date: "January 25, 2026",
    title: "Bug Fixes & Performance",
    type: "fix" as const,
    description: "Various bug fixes and performance improvements across the platform.",
    items: ["Fixed streaming response parsing", "Improved build progress indicator", "Memory optimization"],
  },
  {
    version: "2.3.0",
    date: "January 10, 2026",
    title: "AI Agents Panel",
    type: "feature" as const,
    description: "Visual panel showing infinite AI agents working in parallel on your builds.",
    items: ["Agent activity visualization", "Build progress bar", "Particle explosion on completion"],
  },
];

const typeConfig = {
  feature: { icon: Sparkles, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "Feature" },
  improvement: { icon: Rocket, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Improvement" },
  fix: { icon: Bug, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Fix" },
};

const Changelog = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24">
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 mb-4">[ CHANGELOG ]</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              What's <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">New</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every update, improvement, and fix — documented and transparent.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

              <div className="space-y-10">
                {changelog.map((entry, index) => {
                  const config = typeConfig[entry.type];
                  return (
                    <div key={index} className="relative pl-16">
                      {/* Timeline dot */}
                      <div className={`absolute left-4 top-2 w-5 h-5 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full ${config.color.replace("text-", "bg-")}`} />
                      </div>

                      <div className="glass-card p-6 hover:border-primary/30 transition-all duration-300">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="font-mono text-sm font-bold text-foreground">v{entry.version}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">{entry.date}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{entry.description}</p>
                        <ul className="space-y-1.5">
                          {entry.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 rounded-full bg-primary/40" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        <FunFactsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;
