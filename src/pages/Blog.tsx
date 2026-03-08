import { useState } from "react";
import { Link } from "react-router-dom";
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

        {/* All Pages Directory */}
        <div className="relative py-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="text-center mb-8">
            <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 relative inline-block">
              <span className="absolute -left-6 text-primary/30">[ </span>
              ✦ Explore All Pages ✦
              <span className="absolute -right-6 text-primary/30"> ]</span>
            </p>
            <div className="mt-2 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <div className="flex justify-center gap-3 flex-wrap px-4 max-w-4xl mx-auto">
            {[
              { to: "/home", label: "🏠 Home", gradient: "from-red-600 to-red-500 shadow-red-500/20 hover:shadow-red-500/40" },
              { to: "/tutorials", label: "📚 Tutorials", gradient: "from-green-600 to-green-500 shadow-green-500/20 hover:shadow-green-500/40" },
              { to: "/docs", label: "📖 Documentation", gradient: "from-purple-600 to-purple-500 shadow-purple-500/20 hover:shadow-purple-500/40" },
              { to: "/gallery", label: "🎮 Gallery", gradient: "from-orange-600 to-orange-500 shadow-orange-500/20 hover:shadow-orange-500/40" },
              { to: "/community", label: "💬 Community", gradient: "from-pink-600 to-pink-500 shadow-pink-500/20 hover:shadow-pink-500/40" },
              { to: "/about", label: "👥 About Us", gradient: "from-teal-600 to-teal-500 shadow-teal-500/20 hover:shadow-teal-500/40" },
              { to: "/owner", label: "👑 Owner", gradient: "from-amber-600 to-amber-500 shadow-amber-500/20 hover:shadow-amber-500/40" },
              { to: "/careers", label: "💼 Careers", gradient: "from-sky-600 to-sky-500 shadow-sky-500/20 hover:shadow-sky-500/40" },
              { to: "/contact", label: "✉️ Contact", gradient: "from-lime-600 to-lime-500 shadow-lime-500/20 hover:shadow-lime-500/40" },
              { to: "/press", label: "📰 Press", gradient: "from-fuchsia-600 to-fuchsia-500 shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40" },
              { to: "/features", label: "⚡ Features", gradient: "from-cyan-600 to-cyan-500 shadow-cyan-500/20 hover:shadow-cyan-500/40" },
              { to: "/pricing", label: "💰 Pricing", gradient: "from-emerald-600 to-emerald-500 shadow-emerald-500/20 hover:shadow-emerald-500/40" },
              { to: "/marketplace", label: "🏪 Marketplace", gradient: "from-indigo-600 to-indigo-500 shadow-indigo-500/20 hover:shadow-indigo-500/40" },
              { to: "/changelog", label: "📋 Changelog", gradient: "from-rose-600 to-rose-500 shadow-rose-500/20 hover:shadow-rose-500/40" },
              { to: "/roadmap", label: "🗺️ Roadmap", gradient: "from-violet-600 to-violet-500 shadow-violet-500/20 hover:shadow-violet-500/40" },
              { to: "/privacy", label: "🔒 Privacy", gradient: "from-gray-600 to-gray-500 shadow-gray-500/20 hover:shadow-gray-500/40" },
              { to: "/terms", label: "📄 Terms", gradient: "from-stone-600 to-stone-500 shadow-stone-500/20 hover:shadow-stone-500/40" },
              { to: "/security", label: "🛡️ Security", gradient: "from-red-600 to-red-500 shadow-red-500/20 hover:shadow-red-500/40" },
            ].map((page) => (
              <Button
                key={page.to}
                asChild
                className={`bg-gradient-to-r ${page.gradient} text-white hover:scale-105 transition-all duration-300 border-0 shadow-lg`}
              >
                <Link to={page.to}>{page.label}</Link>
              </Button>
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
