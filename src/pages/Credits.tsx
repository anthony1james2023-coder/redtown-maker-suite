import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Zap, Crown, Code2, Palette } from "lucide-react";

const Credits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Heart className="w-3 h-3 mr-1" /> Credits
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Made with{" "}
              <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Love</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Redtown 2 was brought to life by Kenneth, powered by Lovable.
            </p>
          </div>

          {/* Main Credits */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-500" />
              <CardContent className="p-8 relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-red-500/30">
                    K
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Kenneth</h3>
                    <p className="text-muted-foreground">Creator & Owner</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Crown, text: "Founder & visionary behind Redtown 2" },
                    { icon: Sparkles, text: "Concept, design direction & ideas" },
                    { icon: Zap, text: "Project management & leadership" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-muted-foreground">
                      <item.icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
              <CardContent className="p-8 relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Lovable</h3>
                    <p className="text-muted-foreground">AI Development Platform</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Code2, text: "Full-stack code generation & architecture" },
                    { icon: Palette, text: "UI/UX design & component system" },
                    { icon: Zap, text: "AI-powered development & deployment" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-muted-foreground">
                      <item.icon className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Special Thanks */}
          <div className="text-center max-w-2xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Special Thanks</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To every creator who uses Redtown 2 to bring their game ideas to life. 
                  You are the reason we keep building. Thank you for being part of this journey.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Made with</span>
                  <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                  <span>by Kenneth × Lovable</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Credits;
