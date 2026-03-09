import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Briefcase, Heart, Zap, Users, Coffee, Gamepad2 } from "lucide-react";

const perks = [
  { icon: Heart, label: "Health & Wellness", desc: "Full medical, dental, and vision coverage" },
  { icon: Coffee, label: "Flexible Hours", desc: "Work when you're most productive" },
  { icon: Gamepad2, label: "Game Time", desc: "Weekly game sessions with the team" },
  { icon: Zap, label: "Learning Budget", desc: "$2,000/year for courses and conferences" },
];

const openings = [
  { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote", type: "Full-time", description: "Build and maintain our game builder platform using React, TypeScript, and modern web technologies." },
  { title: "AI/ML Engineer", team: "AI", location: "Remote", type: "Full-time", description: "Develop AI-powered game generation features and improve our neural network models." },
  { title: "Game Designer", team: "Design", location: "Remote", type: "Full-time", description: "Create engaging game templates, mechanics, and experiences for our community." },
  { title: "Community Manager", team: "Community", location: "Remote", type: "Full-time", description: "Grow and nurture our community of 50,000+ game builders worldwide." },
  { title: "DevOps Engineer", team: "Infrastructure", location: "Remote", type: "Full-time", description: "Scale our infrastructure to support millions of games and real-time collaboration." },
  { title: "Technical Writer", team: "Content", location: "Remote", type: "Part-time", description: "Write documentation, tutorials, and guides for our game builder platform." },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time", description: "Design intuitive interfaces for complex game-building workflows." },
  { title: "Marketing Specialist", team: "Marketing", location: "Remote", type: "Full-time", description: "Drive growth through content marketing, social media, and partnerships." },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Careers</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Build the Future of <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Game Creation</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our team and help millions of people bring their game ideas to life.
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {perks.map((perk) => (
              <Card key={perk.label} className="text-center bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-6">
                  <perk.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="font-bold text-foreground mb-1">{perk.label}</div>
                  <div className="text-xs text-muted-foreground">{perk.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Openings */}
          <h2 className="text-2xl font-bold text-center mb-8">Open Positions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {openings.map((job) => (
              <Card key={job.title} className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{job.team}</Badge>
                      <Badge variant="outline" className="border-primary/30">{job.type}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.team}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
