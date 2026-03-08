import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Download, ExternalLink, Calendar } from "lucide-react";

const pressReleases = [
  { date: "Mar 1, 2026", title: "Redtown 2 Reaches 50,000 Community Members", excerpt: "Our community of game builders has grown to over 50,000 active members worldwide." },
  { date: "Feb 15, 2026", title: "AI Game Builder 3.0 Launch", excerpt: "Introducing the most powerful AI-powered game creation engine with real-time collaboration." },
  { date: "Jan 20, 2026", title: "Partnership with Major Game Studios", excerpt: "Redtown 2 partners with leading studios to bring professional-grade tools to indie developers." },
  { date: "Dec 10, 2025", title: "12,000 Games Created on Redtown 2", excerpt: "Milestone reached as users create their twelve-thousandth game on the platform." },
  { date: "Nov 5, 2025", title: "Redtown 2 Wins Best Creator Tool Award", excerpt: "Recognized as the best game creation platform at the annual Digital Tools Summit." },
  { date: "Oct 1, 2025", title: "New Marketplace Launch", excerpt: "Creators can now buy and sell game assets, templates, and plugins in our new marketplace." },
];

const mediaCoverage = [
  { outlet: "TechCrunch", title: "Redtown 2 is democratizing game development", date: "Feb 2026" },
  { outlet: "The Verge", title: "AI-powered game builder you need to try", date: "Jan 2026" },
  { outlet: "Wired", title: "The future of no-code game creation", date: "Dec 2025" },
  { outlet: "VentureBeat", title: "Redtown 2 raises awareness for indie devs", date: "Nov 2025" },
];

const Press = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Press</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Press & Media</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Latest news, press releases, and media resources for Redtown 2.
            </p>
          </div>

          {/* Brand Assets */}
          <Card className="mb-16 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-8 text-center">
              <Download className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold mb-2">Brand Assets & Press Kit</h2>
              <p className="text-muted-foreground mb-4">Download logos, screenshots, and brand guidelines.</p>
              <Button size="lg"><Download className="w-4 h-4 mr-2" /> Download Press Kit</Button>
            </CardContent>
          </Card>

          {/* Press Releases */}
          <h2 className="text-2xl font-bold text-center mb-8">Press Releases</h2>
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            {pressReleases.map((pr) => (
              <Card key={pr.title} className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" /> {pr.date}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{pr.title}</h3>
                  <p className="text-sm text-muted-foreground">{pr.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Media Coverage */}
          <h2 className="text-2xl font-bold text-center mb-8">Media Coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {mediaCoverage.map((item) => (
              <Card key={item.title} className="hover:border-primary/30 transition-all bg-card/50 backdrop-blur-sm">
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2">{item.outlet}</Badge>
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
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

export default Press;
