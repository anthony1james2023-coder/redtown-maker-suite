import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import FunFactsSection from "@/components/FunFactsSection";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-12 text-center">
          <div className="container mx-auto px-4">
            <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 mb-4">[ PRICING ]</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Simple, <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Powerful</span> Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises. All plans free for 30 days.
            </p>
          </div>
        </section>

        <PricingSection />

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is there really a free trial?", a: "Yes! All plans are completely free for 30 days. No credit card required to start." },
                { q: "Can I switch plans later?", a: "Absolutely. Upgrade or downgrade at any time. Changes take effect immediately." },
                { q: "What happens after the free trial?", a: "You can continue on the Starter plan for free, or subscribe to Core or Team for full features." },
                { q: "Do you offer refunds?", a: "Yes, we offer a 14-day money-back guarantee on all paid plans." },
                { q: "Is there a student discount?", a: "Yes! Students get 50% off all paid plans with a valid .edu email address." },
              ].map((faq, i) => (
                <div key={i} className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <FunFactsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
