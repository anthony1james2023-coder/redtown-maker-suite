import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard as CreditCardIcon, Tag, Check, Sparkles, Building2, Gift, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Coupon {
  id: string;
  code: string;
  plan: string;
  duration_description: string;
  price: number;
  max_uses: number;
  current_uses: number;
  is_secret: boolean;
}

const CreditCard = () => {
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const { data } = await supabase
        .from("coupons")
        .select("*")
        .eq("active", true)
        .eq("is_secret", false);
      if (data) setCoupons(data as Coupon[]);
    };
    fetchCoupons();
  }, []);

  const handleRedeem = async () => {
    if (!user) {
      toast.error("Sign in first to redeem a coupon");
      return;
    }
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }

    setRedeeming(true);
    try {
      const { data, error } = await supabase.rpc("redeem_coupon", {
        p_code: couponCode.trim(),
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; plan?: string; duration?: string };
      if (result.success) {
        toast.success(`🎉 ${result.plan?.toUpperCase()} plan activated! ${result.duration}`);
        setCouponCode("");
      } else {
        toast.error(result.error || "Failed to redeem coupon");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to redeem coupon");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-12 text-center">
          <div className="container mx-auto px-4">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 mb-6">
              <CreditCardIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Redtown <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Credits</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-2">
              Redeem coupon codes to unlock Core or Team plans instantly.
            </p>
            <p className="text-sm text-muted-foreground">
              Coming soon to Target & Walmart — physical credit cards!
            </p>
          </div>
        </section>

        {/* Redeem Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-lg">
            <Card className="border-primary/30">
              <CardHeader className="text-center">
                <Ticket className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle>Redeem a Coupon</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {user ? "Enter your coupon code below" : "Sign in first to redeem coupons"}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                  placeholder="Enter coupon code..."
                  className="text-center font-mono text-lg tracking-wider"
                />
                <Button
                  className="w-full"
                  onClick={handleRedeem}
                  disabled={redeeming || !user}
                >
                  {redeeming ? "Redeeming..." : <><Gift className="h-4 w-4 mr-2" /> Redeem Code</>}
                </Button>
                {!user && (
                  <p className="text-center text-xs text-muted-foreground">
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link> to redeem coupons
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Available Coupons */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-8">Available Coupons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="glass-card p-5 relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => setCouponCode(coupon.code)}
                >
                  {/* Plan badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg ${
                      coupon.plan === "core"
                        ? "bg-gradient-to-br from-red-600 to-red-500"
                        : "bg-gradient-to-br from-purple-600 to-purple-500"
                    }`}>
                      {coupon.plan === "core" ? (
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {coupon.plan}
                    </span>
                  </div>

                  <p className="font-semibold text-sm mb-1">{coupon.duration_description}</p>
                  <p className="font-mono text-xs text-muted-foreground mb-3 break-all">
                    {coupon.code}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{coupon.price === 0 ? "FREE" : `$${coupon.price}`}</span>
                    <span>{coupon.max_uses - coupon.current_uses} uses left</span>
                  </div>

                  {/* Click hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold text-primary">Click to use</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CreditCard;
