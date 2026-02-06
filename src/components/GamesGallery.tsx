import { useState, useEffect } from "react";
import { Play, Gamepad2, Sparkles, Star, Zap, Trophy, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { downloadGame } from "@/lib/downloadGame";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Game {
  id: string;
  name: string;
  description: string | null;
  preview_html: string | null;
  created_at: string;
}

// Gradient backgrounds for game cards
const gradients = [
  "from-red-600/20 via-orange-500/10 to-yellow-500/20",
  "from-purple-600/20 via-pink-500/10 to-red-500/20",
  "from-blue-600/20 via-cyan-500/10 to-green-500/20",
  "from-indigo-600/20 via-purple-500/10 to-pink-500/20",
  "from-green-600/20 via-emerald-500/10 to-teal-500/20",
  "from-orange-600/20 via-red-500/10 to-pink-500/20",
];

const GamesGallery = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

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

  if (loading) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-400" />
        </div>
      </section>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-24 relative overflow-hidden" id="gallery">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-red-950/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 mb-6">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Community Creations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Epic Games</span> Built by AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These masterpieces were created in seconds by our ∞ Infinite AI workforce. 
              Click to play instantly!
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="group relative"
              >
                {/* Card */}
                <div className={`
                  relative overflow-hidden rounded-2xl border border-white/10
                  bg-gradient-to-br ${gradients[index % gradients.length]}
                  backdrop-blur-xl transition-all duration-500
                  hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20
                  hover:-translate-y-2
                `}>
                  {/* Thumbnail */}
                  <div className="aspect-video relative overflow-hidden bg-black/50">
                    {game.preview_html ? (
                      <iframe
                        srcDoc={game.preview_html}
                        className="w-full h-full border-0 pointer-events-none scale-100"
                        title={game.name}
                        sandbox="allow-scripts"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gamepad2 className="w-16 h-16 text-red-500/30" />
                      </div>
                    )}
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                      <Button
                        size="lg"
                        variant="hero"
                        onClick={() => setPlayingGame(game)}
                        className="gap-2 shadow-2xl shadow-red-500/50 transform scale-90 group-hover:scale-100 transition-transform"
                      >
                        <Play className="w-5 h-5" />
                        Play
                      </Button>
                      {game.preview_html && (
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            downloadGame(game.preview_html!, game.name);
                            toast.success("Game downloaded!");
                          }}
                          className="gap-2 border-white/30 bg-black/50 hover:bg-white/10 transform scale-90 group-hover:scale-100 transition-transform"
                        >
                          <Download className="w-5 h-5" />
                          Download
                        </Button>
                      )}
                    </div>

                    {/* Live badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-green-500/30">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Live</span>
                    </div>

                    {/* AI badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-red-500/30">
                      <Sparkles className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">AI Built</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate group-hover:text-red-400 transition-colors">
                          {game.name}
                        </h3>
                        {game.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {game.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">
                          {(4.5 + Math.random() * 0.5).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>10s build</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3 text-purple-400" />
                        <span>{Math.floor(Math.random() * 500 + 100)} plays</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="gap-2 border-red-500/30 hover:bg-red-500/10">
              <Gamepad2 className="w-5 h-5" />
              View All Games
            </Button>
          </div>
        </div>
      </section>

      {/* Fullscreen Play Dialog */}
      <Dialog open={!!playingGame} onOpenChange={() => setPlayingGame(null)}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden bg-black/95 backdrop-blur-xl border-red-500/30">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                  <Play className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium">{playingGame?.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">Built by ∞ AIs in 10 seconds</span>
              </div>
              {playingGame?.preview_html && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    downloadGame(playingGame.preview_html!, playingGame.name);
                    toast.success("Game downloaded!");
                  }}
                  className="gap-2 border-white/30 bg-black/50 hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full h-full pt-14">
            {playingGame?.preview_html ? (
              <iframe
                srcDoc={playingGame.preview_html}
                className="w-full h-full border-0"
                title={playingGame.name}
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p>No preview available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GamesGallery;
