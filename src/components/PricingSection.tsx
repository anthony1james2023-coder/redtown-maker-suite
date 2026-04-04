import { Button } from "@/components/ui/button";
import { Check, Sparkles, Building2, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for learning and experimenting",
    icon: Zap,
    features: [
      "Access to AI models",
      "5 projects",
      "Basic hosting",
      "Community support",
      "Public deployments",
    ],
    cta: "Start Building",
    popular: false,
  },
  {
    name: "Core",
    price: "$19",
    period: "/month",
    description: "Everything you need to build and ship",
    icon: Sparkles,
    features: [
      "Everything in Starter",
      "Access to latest models",
      "Publish and host live apps",
      "Autonomous long builds",
      'Remove "Redtown" badge',
      "Unlimited projects",
      "Priority support",
      "Custom domains",
    ],
    cta: "Get Core",
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/user/month",
    description: "Bring Redtown 2 to your entire team",
    icon: Building2,
    features: [
      "Everything in Core",
      "Google SSO sign-in",
      "Upfront credits on annual",
      "50 Viewer seats",
      "Centralized billing",
      "Role-based access control",
      "Private deployments",
      "Dedicated support",
    ],
    cta: "Get Team",
    popular: false,
  },
];
const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Powerful</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass-card p-8 flex flex-col ${
                plan.popular 
                  ? 'border-red-500/50 glow-effect scale-105 md:-mt-4 md:mb-4' 
                  : 'hover:border-border'
              } transition-all duration-300`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-sm font-semibold text-white shadow-lg shadow-red-500/30">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-red-600 to-red-500' 
                    : 'bg-secondary'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.popular ? 'text-red-400' : 'text-muted-foreground'
                    }`} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.name === "Core" ? (
                <a href="https://buy.stripe.com/test_3cI8wP81y4pk3zgc81eUU00" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="hero" size="lg" className="w-full">{plan.cta}</Button>
                </a>
              ) : plan.name === "Team" ? (
                <a href="https://buy.stripe.com/test_7sYcN55Tq1d89XEgoheUU01" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">{plan.cta}</Button>
                </a>
              ) : (
                <Link to="/builder" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">{plan.cta}</Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="glass-card inline-block px-8 py-6 max-w-2xl">
            <h3 className="text-xl font-semibold mb-2">Need more?</h3>
            <p className="text-muted-foreground mb-4">
              Custom enterprise solutions with dedicated infrastructure, SLAs, and 24/7 support.
            </p>
            <Button variant="hero-outline">Contact Sales</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
