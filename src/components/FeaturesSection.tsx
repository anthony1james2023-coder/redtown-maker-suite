import { 
  Cpu, 
  Globe, 
  Gamepad2, 
  Smartphone, 
  Cloud, 
  Zap,
  Code2,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Coding",
    description: "Latest AI models generate production-ready code. Build apps 10x faster with intelligent assistance.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    description: "Publish and host live apps instantly. Your projects go live in seconds, not hours.",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: Smartphone,
    title: "App Store Ready",
    description: "Deploy straight to the App Store and Play Store. Cross-platform mobile apps with zero config.",
    gradient: "from-red-600 to-red-400",
  },
  {
    icon: Gamepad2,
    title: "Browser Games",
    description: "Create and host browser games including Eaglercraft-style experiences. Gaming made easy.",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Autonomous Builds",
    description: "Long autonomous builds run in the cloud. Set it and forget it — we handle the rest.",
    gradient: "from-orange-400 to-red-500",
  },
  {
    icon: Code2,
    title: "Extreme Coding",
    description: "More powerful than GitHub. Version control, collaboration, and deployment all in one place.",
    gradient: "from-red-400 to-orange-400",
  },
  {
    icon: Shield,
    title: "Private Deployments",
    description: "Enterprise-grade security with private deployments. Your code stays yours.",
    gradient: "from-red-500 to-red-700",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Optimized infrastructure for lightning-fast performance. Your apps load instantly.",
    gradient: "from-yellow-500 to-red-500",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Build Anything</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From idea to production in minutes. Redtown 2 combines the power of AI with enterprise-grade infrastructure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-card p-6 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15),0_0_40px_hsl(var(--primary)/0.08),inset_0_0_20px_hsl(var(--primary)/0.05)]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
