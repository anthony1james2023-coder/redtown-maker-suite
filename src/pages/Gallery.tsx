import { useState } from "react";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { galleryItems, galleryCategories } from "@/data/galleryItems";
import { Heart, Filter, Gamepad2 } from "lucide-react";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((g) => g.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Gamepad2 className="w-3 h-3 mr-1" /> Gallery
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Showcase</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore amazing games built by our community of creators.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap justify-center mb-10">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            {galleryCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <Card key={item.id} className="group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm overflow-hidden">
                {/* Gradient placeholder image */}
                <div className={`h-40 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <Gamepad2 className="w-12 h-12 text-white/50" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3 text-red-400" /> {item.likes}
                    </span>
                  </div>
                  <h3 className="font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">by {item.creator}</p>
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

export default Gallery;
