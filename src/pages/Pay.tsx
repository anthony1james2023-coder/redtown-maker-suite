import { useState } from "react";
import { Check, Zap, Sparkles, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";

const plans = [
  {
    id: "starter",
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
    stripeLink: null,
  },
  {
    id: "core",
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
    stripeLink: "https://buy.stripe.com/test_3cI8wP81y4pk3zgc81eUU00",
    popular: true,
  },
  {
    id: "team",
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
    stripeLink: "https://buy.stripe.com/test_3cI8wP81y4pk3zgc81eUU00",
  },
];

const Pay = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("core");

  const handleCheckout = () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    if (plan?.stripeLink) {
      window.open(plan.stripeLink, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-20">
        <section className="py-12 text-center">
          <div className="container mx-auto px-4">
            <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 mb-4">
              [ CHECKOUT ]
            </p>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Plan
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Select a plan and complete your purchase securely with Stripe.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative glass-card p-6 text-left transition-all duration-300 cursor-pointer ${
                  selectedPlan === plan.id
                    ? "border-red-500 ring-2 ring-red-500/30 scale-[1.02]"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedPlan === plan.id
                        ? "bg-gradient-to-br from-red-600 to-red-500"
                        : "bg-secondary"
                    }`}
                  >
                    <plan.icon
                      className={`w-5 h-5 ${
                        selectedPlan === plan.id
                          ? "text-white"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                <div className="mb-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>

                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          selectedPlan === plan.id
                            ? "text-red-400"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Selection indicator */}
                <div
                  className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPlan === plan.id
                      ? "border-red-500 bg-red-500"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Checkout Button */}
          <div className="text-center">
            {selectedPlan === "starter" ? (
              <div className="glass-card inline-block px-8 py-6">
                <p className="text-lg font-semibold mb-2">
                  Starter is free — no payment needed!
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Just sign up and start building.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <a href="/builder-agent-2">Start Building Free</a>
                </Button>
              </div>
            ) : (
              <div className="glass-card inline-block px-8 py-6">
                <p className="text-lg font-semibold mb-2">
                  Ready to upgrade to{" "}
                  <span className="text-red-400">
                    {plans.find((p) => p.id === selectedPlan)?.name}
                  </span>
                  ?
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  You'll be redirected to Stripe for secure payment.
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleCheckout}
                  className="gap-2"
                >
                  Continue to Payment <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pay;
