import { useState } from "react";
import { funFacts } from "@/data/funFacts";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL_COUNT = 20;

const FunFactsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleFacts = showAll ? funFacts : funFacts.slice(0, INITIAL_COUNT);

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Did You Know?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            100 <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Fun Facts</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Mind-blowing facts to brighten your day ✨
          </p>
        </div>

        {/* Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {visibleFacts.map((fact, i) => (
            <div
              key={i}
              className="glass-card p-4 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                  {fact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Less */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show All 100 Facts
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FunFactsSection;
