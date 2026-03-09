import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bug, ThumbsUp, AlertTriangle, CheckCircle, Brain, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categoryIcons: Record<string, React.ReactNode> = {
  syntax: <Bug className="h-4 w-4" />,
  logic: <Brain className="h-4 w-4" />,
  design: <Zap className="h-4 w-4" />,
  hallucination: <AlertTriangle className="h-4 w-4" />,
  performance: <Zap className="h-4 w-4" />,
  other: <Bug className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  syntax: "bg-destructive/10 text-destructive border-destructive/30",
  logic: "bg-primary/10 text-primary border-primary/30",
  design: "bg-accent text-accent-foreground border-accent",
  hallucination: "bg-destructive/20 text-destructive border-destructive/40",
  performance: "bg-secondary text-secondary-foreground border-border",
  other: "bg-muted text-muted-foreground border-border",
};

type Mistake = {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  upvotes: number;
  created_at: string;
};

const AgentMistakes = () => {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMistakes();
  }, []);

  const fetchMistakes = async () => {
    const { data, error } = await supabase
      .from("ai_mistakes")
      .select("*")
      .order("upvotes", { ascending: false });

    if (!error && data) setMistakes(data);
    setLoading(false);
  };

  const handleUpvote = async (id: string) => {
    if (votedIds.has(id)) {
      toast({ title: "Already voted", description: "You already upvoted this mistake." });
      return;
    }
    const mistake = mistakes.find((m) => m.id === id);
    if (!mistake) return;

    const { error } = await supabase
      .from("ai_mistakes")
      .update({ upvotes: mistake.upvotes + 1 })
      .eq("id", id);

    if (!error) {
      setMistakes((prev) =>
        prev
          .map((m) => (m.id === id ? { ...m, upvotes: m.upvotes + 1 } : m))
          .sort((a, b) => b.upvotes - a.upvotes)
      );
      setVotedIds((prev) => new Set(prev).add(id));
      toast({ title: "Upvoted!", description: "Thanks for your feedback." });
    }
  };

  const categories = ["all", ...Array.from(new Set(mistakes.map((m) => m.category)))];
  const filtered = filter === "all" ? mistakes : mistakes.filter((m) => m.category === filter);
  const fixedCount = mistakes.filter((m) => m.status === "fixed").length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/welcome">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/5 text-destructive text-sm font-mono tracking-widest uppercase">
            <Bug className="h-4 w-4" />
            AI Mistake Log
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Agent{" "}
            <span className="bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
              Mistakes
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Every mistake makes the AI smarter. Track what went wrong and help us improve.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-foreground">{mistakes.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">{fixedCount}</p>
              <p className="text-sm text-muted-foreground">Fixed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-destructive">{categories.length - 1}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Mistake Cards */}
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading mistakes...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No mistakes found.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((mistake) => (
              <Card key={mistake.id} className="hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Badge className={categoryColors[mistake.category] || categoryColors.other}>
                        {categoryIcons[mistake.category] || categoryIcons.other}
                        <span className="ml-1 capitalize">{mistake.category}</span>
                      </Badge>
                      <Badge variant={mistake.status === "fixed" ? "default" : "outline"} className="text-xs">
                        {mistake.status === "fixed" ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Fixed</>
                        ) : (
                          "Learning"
                        )}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpvote(mistake.id)}
                      className={votedIds.has(mistake.id) ? "border-primary text-primary" : ""}
                    >
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      {mistake.upvotes}
                    </Button>
                  </div>
                  <CardTitle className="text-lg mt-2">{mistake.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{mistake.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(mistake.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AgentMistakes;
