import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tutorials, difficultyLevels } from "@/data/tutorials";
import { Clock, Layers, BookOpen } from "lucide-react";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const Tutorials = () => {
  const [activeLevel, setActiveLevel] = useState("All");

  const filtered = activeLevel === "All"
    ? tutorials
    : tutorials.filter((t) => t.difficulty === activeLevel);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <BookOpen className="w-3 h-3 mr-1" /> Tutorials
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn to <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Build Games</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Step-by-step guides from beginner to advanced. Master game development at your own pace.
            </p>
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-2 flex-wrap justify-center mb-10">
            <Layers className="w-4 h-4 text-muted-foreground mr-1" />
            {difficultyLevels.map((level) => (
              <Button
                key={level}
                variant={activeLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tut) => (
              <Card key={tut.id} className="group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`text-xs border ${difficultyColors[tut.difficulty]}`}>
                      {tut.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{tut.steps} steps</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {tut.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tut.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">{tut.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tut.duration}
                    </span>
                  </div>
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

export default Tutorials;
