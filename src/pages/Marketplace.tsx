import { useState, useEffect, useMemo } from "react";
import { Search, Download, Play, Gamepad2, Star, Zap, Trophy, Loader2, Filter, Grid3X3, LayoutList, Sparkles, Users, TrendingUp, RefreshCw, Flame, Crown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { downloadGame } from "@/lib/downloadGame";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showcaseGames, showcaseEmojis } from "@/data/showcaseGames";
import FunFactsSection from "@/components/FunFactsSection";
import { getGameHtml } from "@/data/gameHtml";

interface Game {
  id: string;
  name: string;
  description: string | null;
  preview_html: string | null;
  created_at: string;
  isShowcase?: boolean;
  category?: string;
  showcaseColor?: string;
}

const categories = [
  { id: "all", label: "All Games", icon: Grid3X3 },
  { id: "arcade", label: "Arcade", icon: Zap },
  { id: "puzzle", label: "Puzzle", icon: Grid3X3 },
  { id: "action", label: "Action", icon: Trophy },
  { id: "strategy", label: "Strategy", icon: TrendingUp },
  { id: "casual", label: "Casual", icon: Sparkles },
  { id: "racing", label: "Racing", icon: Flame },
  { id: "rpg", label: "RPG", icon: Crown },
];

const gradients = [
  "from-red-600/20 via-orange-500/10 to-yellow-500/20",
  "from-purple-600/20 via-pink-500/10 to-red-500/20",
  "from-blue-600/20 via-cyan-500/10 to-green-500/20",
  "from-indigo-600/20 via-purple-500/10 to-pink-500/20",
  "from-green-600/20 via-emerald-500/10 to-teal-500/20",
  "from-orange-600/20 via-red-500/10 to-pink-500/20",
  "from-cyan-600/20 via-blue-500/10 to-indigo-500/20",
  "from-yellow-600/20 via-orange-500/10 to-red-500/20",
];

const Marketplace = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setGames(data || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const allGames = useMemo(() => [...showcaseGames, ...games], [games]);
  const totalCount = allGames.length;

  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(search.toLowerCase()) ||
        game.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || (game as any).category === category;
      return matchesSearch && matchesCategory;
    });
  }, [allGames, search, category]);

  const getGameStats = (id: string) => {
    const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return {
      rating: (4.0 + (hash % 10) / 10).toFixed(1),
      plays: (hash % 9000) + 1000,
      downloads: (hash % 5000) + 500,
    };
  };

  const handleRemix = (game: Game) => {
    navigate("/builder", { state: { remixGame: game } });
    toast.success(`Remixing "${game.name}" — edit it in the builder!`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* === CYBERPUNK DECORATIONS === */}
      {/* Scan lines */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 3px)" }}
      />
      {/* Floating orbs */}
      <div className="pointer-events-none fixed top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse" />
      <div className="pointer-events-none fixed bottom-40 right-20 w-96 h-96 rounded-full bg-primary/3 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none fixed top-1/2 left-1/3 w-48 h-48 rounded-full bg-blue-500/5 blur-[80px] animate-pulse" style={{ animationDelay: "4s" }} />
      {/* Matrix rain columns */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden opacity-[0.04]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-primary font-mono text-[10px] leading-tight whitespace-pre animate-matrixfall"
            style={{
              left: `${(i / 12) * 100}%`,
              animationDuration: `${8 + (i % 5) * 3}s`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {Array.from({ length: 30 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join("\n")}
          </div>
        ))}
      </div>
      {/* Corner hex patterns */}
      <div className="pointer-events-none fixed top-0 right-0 w-64 h-64 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />
      <div className="pointer-events-none fixed bottom-0 left-0 w-64 h-64 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        {/* Animated accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-flex items-center gap-1 transition-colors">
            ← Back to Home
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Game Marketplace</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="gradient-text">Game Marketplace</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Play, download, and remix {totalCount}+ games built by AI in seconds.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{totalCount} games</span>
              </div>
              <Button variant="hero" onClick={() => navigate("/builder")} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create Game
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={category === cat.id ? "hero" : "outline"}
                  onClick={() => setCategory(cat.id)}
                  className="gap-1.5 whitespace-nowrap"
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </Button>
              ))}
              <div className="ml-auto flex gap-1">
                <Button size="icon" variant={viewMode === "grid" ? "secondary" : "ghost"} onClick={() => setViewMode("grid")}>
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant={viewMode === "list" ? "secondary" : "ghost"} onClick={() => setViewMode("list")}>
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="relative overflow-hidden border-b border-border/30 bg-primary/[0.03] py-1.5">
        <div className="flex animate-ticker whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, rep) => (
            <div key={rep} className="flex items-center gap-6 px-6 text-xs text-muted-foreground font-mono">
              <span>🔥 TRENDING: Neon Racer X</span>
              <span className="text-primary/30">|</span>
              <span>⭐ TOP RATED: Chess AI Master</span>
              <span className="text-primary/30">|</span>
              <span>🆕 NEW: Shadow Knight RPG</span>
              <span className="text-primary/30">|</span>
              <span>🏆 MOST PLAYED: Galaxy Defender 3000</span>
              <span className="text-primary/30">|</span>
              <span>📈 {totalCount}+ GAMES AVAILABLE</span>
              <span className="text-primary/30">|</span>
              <span>⚡ SYSTEMS ONLINE</span>
              <span className="text-primary/30">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-24">
            <Gamepad2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No games found</h3>
            <p className="text-muted-foreground">Try a different search or create your own!</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredGames.map((game, index) => {
              const stats = getGameStats(game.id);
              const isShowcase = (game as any).isShowcase;
              const emoji = isShowcase ? showcaseEmojis[(game as any).category] || "🎮" : null;
              return (
                <div key={game.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                  <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${
                    isShowcase
                      ? `border-primary/30 bg-gradient-to-br ${(game as any).showcaseColor} backdrop-blur-xl hover:border-primary/60 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]`
                      : `border-border/50 bg-gradient-to-br ${gradients[index % gradients.length]} backdrop-blur-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10`
                  }`}>
                    {/* Thumbnail */}
                    <div className="aspect-video relative overflow-hidden bg-secondary/30">
                      {(() => { const html = getGameHtml(game.id) || game.preview_html; return html ? (
                        <iframe
                          srcDoc={html}
                          className="w-full h-full border-0 pointer-events-none"
                          title={game.name}
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {emoji || <Gamepad2 className="w-12 h-12 text-primary/20" />}
                        </div>
                      ); })()}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                        <Button size="sm" variant="hero" onClick={() => setPlayingGame(game)} className="gap-1.5">
                          <Play className="w-4 h-4" /> Play
                        </Button>
                        {(getGameHtml(game.id) || game.preview_html) && (
                          <Button size="sm" variant="outline" onClick={() => { downloadGame(getGameHtml(game.id) || game.preview_html!, game.name); toast.success("Downloaded!"); }} className="gap-1.5 border-foreground/20 bg-background/50">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleRemix(game)} className="gap-1.5 border-foreground/20 bg-background/50">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        {isShowcase && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-xs">
                            <Crown className="w-3 h-3 text-primary" />
                            <span className="text-primary font-medium">Featured</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/70 backdrop-blur-sm border border-primary/20 text-xs">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="text-primary font-medium">AI</span>
                        </div>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{game.name}</h3>
                      {game.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{game.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span>{stats.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gamepad2 className="w-3 h-3" />
                          <span>{stats.plays.toLocaleString()} plays</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{stats.downloads.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGames.map((game, index) => {
              const stats = getGameStats(game.id);
              const isShowcase = (game as any).isShowcase;
              const emoji = isShowcase ? showcaseEmojis[(game as any).category] || "🎮" : null;
              return (
                <div key={game.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all group ${
                  isShowcase ? "border-primary/30 bg-primary/[0.03] hover:border-primary/50" : "border-border/50 bg-card/50 hover:border-primary/30"
                }`}>
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-secondary/30 flex-shrink-0 flex items-center justify-center">
                    {game.preview_html ? (
                      <iframe srcDoc={game.preview_html} className="w-full h-full border-0 pointer-events-none" title={game.name} sandbox="allow-scripts" />
                    ) : (
                      <span className="text-2xl">{emoji || <Gamepad2 className="w-6 h-6 text-primary/20" />}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm truncate">{game.name}</h3>
                      {isShowcase && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-medium">
                          <Crown className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{game.description || "AI-generated game"}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{stats.rating}</span>
                      <span>{stats.plays.toLocaleString()} plays</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="hero" onClick={() => setPlayingGame(game)} className="gap-1"><Play className="w-3 h-3" /> Play</Button>
                    {game.preview_html && (
                      <Button size="sm" variant="outline" onClick={() => { downloadGame(game.preview_html!, game.name); toast.success("Downloaded!"); }}><Download className="w-3 h-3" /></Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleRemix(game)}><RefreshCw className="w-3 h-3" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Play Dialog */}
      <Dialog open={!!playingGame} onOpenChange={() => setPlayingGame(null)}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-primary/30">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background/80 to-transparent">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                  <Play className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">{playingGame?.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {playingGame?.preview_html && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => { downloadGame(playingGame.preview_html!, playingGame.name); toast.success("Downloaded!"); }} className="gap-1.5">
                      <Download className="w-4 h-4" /> Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemix(playingGame)} className="gap-1.5">
                      <RefreshCw className="w-4 h-4" /> Remix
                    </Button>
                  </>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="w-full h-full pt-14">
            {playingGame?.preview_html ? (
              <iframe srcDoc={playingGame.preview_html} className="w-full h-full border-0" title={playingGame.name} sandbox="allow-scripts allow-same-origin" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Gamepad2 className="w-16 h-16 text-primary/20" />
                <p>This is a showcase game — no live preview available yet.</p>
                <Button variant="hero" onClick={() => navigate("/builder")} className="gap-2">
                  <Sparkles className="w-4 h-4" /> Build It Yourself
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <FunFactsSection />
    </div>
  );
};

export default Marketplace;
