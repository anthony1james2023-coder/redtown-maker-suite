import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Youtube, Zap, Gamepad2, Star, ExternalLink } from "lucide-react";

const Owner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Crown className="w-3 h-3 mr-1" /> Owner
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Kenneth</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Creator & Owner of Redtown 2 — Building the future of game development.
            </p>
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto text-white font-bold text-4xl shadow-2xl shadow-red-500/30 mb-8">
              K
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">About Kenneth</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Kenneth is the visionary founder and owner of Redtown 2. With a passion for gaming and technology, he created Redtown 2 to make game development accessible to everyone. His dream is to empower creators worldwide to build amazing games using the power of AI.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">YouTube Channel</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Check out the official Redtown 2 YouTube channel for tutorials, game showcases, development updates, and behind-the-scenes content.
                </p>
                <Button variant="hero" className="gap-2" asChild>
                  <a href="https://www.youtube.com/@redtown2offcial" target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4" />
                    Visit Channel
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {[
              { icon: Gamepad2, label: "Games Created", value: "1,000+" },
              { icon: Star, label: "Community Rating", value: "4.9/5" },
              { icon: Youtube, label: "YouTube Videos", value: "50+" },
              { icon: Crown, label: "Years Building", value: "3+" },
            ].map((stat, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <FunFactsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Owner;
