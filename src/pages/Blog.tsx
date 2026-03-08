import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, blogCategories } from "@/data/blogPosts";
import { Clock, User, Filter } from "lucide-react";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Latest <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">News & Articles</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with tutorials, tips, and the latest Redtown 2 news.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap justify-center mb-10">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            {blogCategories.map((cat) => (
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

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Card key={post.id} className="group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                {/* Gradient header bar */}
                <div className="h-2 rounded-t-lg bg-gradient-to-r from-primary/60 to-destructive/60" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
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

export default Blog;
