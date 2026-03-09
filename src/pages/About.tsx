import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { teamMembers } from "@/data/teamMembers";
import { Users, Target, Rocket, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Users className="w-3 h-3 mr-1" /> About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Redtown 2</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're on a mission to make game development accessible to everyone through the power of AI.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To democratize game development by giving everyone the tools to bring their creative visions to life — no coding required.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A world where anyone can create, share, and play games built from pure imagination, powered by the most advanced AI technology.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Values</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Creativity first. Community driven. Accessible to all. We believe the best games come from diverse voices and bold ideas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Meet the <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The passionate people behind Redtown 2.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {teamMembers.map((member) => (
              <Card key={member.id} className="group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-lg`}>
                    {member.initials}
                  </div>
                  <h3 className="font-bold group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-xs text-primary/70 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
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

export default About;
