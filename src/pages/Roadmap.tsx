import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Check, Clock, Sparkles, ArrowRight } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q1 2026",
    status: "completed" as const,
    items: [
      { title: "Multi-Model AI Support", description: "GPT-5, Gemini 3, Claude integration with model selector", done: true },
      { title: "File Explorer", description: "Full file tree sidebar for multi-file projects", done: true },
      { title: "Image Generation", description: "Built-in AI image generation for project assets", done: true },
      { title: "Cyberpunk UI Overhaul", description: "Matrix rain, hex grid, scan lines, particles", done: true },
      { title: "Special Event Pages", description: "Mother's Day & Father's Day themed builders", done: true },
    ],
  },
  {
    quarter: "Q2 2026",
    status: "in-progress" as const,
    items: [
      { title: "Real-time Collaboration", description: "Multiple users editing the same project simultaneously", done: false },
      { title: "Plugin Marketplace", description: "Community-built plugins and templates", done: false },
      { title: "Mobile App Export", description: "Export projects as native iOS and Android apps", done: false },
      { title: "Voice Commands", description: "Build apps using voice instructions", done: false },
    ],
  },
  {
    quarter: "Q3 2026",
    status: "planned" as const,
    items: [
      { title: "AI Code Review", description: "Automated code review with security scanning", done: false },
      { title: "Team Workspaces", description: "Shared workspaces with role-based permissions", done: false },
      { title: "Git Integration", description: "Push/pull from GitHub, GitLab, Bitbucket", done: false },
      { title: "Custom Domains", description: "Map custom domains to published projects", done: false },
    ],
  },
  {
    quarter: "Q4 2026",
    status: "planned" as const,
    items: [
      { title: "Self-Hosted Option", description: "Deploy Redtown 2 on your own infrastructure", done: false },
      { title: "API Access", description: "Programmatic access to AI building capabilities", done: false },
      { title: "Enterprise SSO", description: "SAML/OIDC authentication for enterprise teams", done: false },
      { title: "Advanced Analytics", description: "Usage analytics and performance monitoring", done: false },
    ],
  },
];

const statusConfig = {
  completed: { label: "Completed", icon: Check, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
  "in-progress": { label: "In Progress", icon: Sparkles, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  planned: { label: "Planned", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
};

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 mb-4">[ ROADMAP ]</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Where We're <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Going</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our vision for Redtown 2 — transparent, ambitious, community-driven.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-16">
              {roadmapItems.map((quarter, qIndex) => {
                const config = statusConfig[quarter.status];
                return (
                  <div key={qIndex}>
                    {/* Quarter Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-3xl font-black">{quarter.quarter}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} ${config.border} border flex items-center gap-1.5`}>
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                    </div>

                    {/* Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quarter.items.map((item, iIndex) => (
                        <div
                          key={iIndex}
                          className={`glass-card p-6 transition-all duration-300 hover:border-primary/30 ${
                            item.done ? "opacity-80" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              item.done
                                ? "bg-green-500/20 border-green-500/50"
                                : "border-border"
                            }`}>
                              {item.done && <Check className="w-3 h-3 text-green-400" />}
                            </div>
                            <div>
                              <h3 className={`font-semibold mb-1 ${item.done ? "line-through text-muted-foreground" : ""}`}>
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suggest Feature */}
            <div className="mt-20 text-center">
              <div className="glass-card max-w-xl mx-auto p-10">
                <h2 className="text-2xl font-bold mb-3">Have a feature idea?</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  We build what you need. Share your ideas and vote on what matters most.
                </p>
                <a href="#community" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                  Join the community <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Roadmap;
