import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Trophy, Star, Github, Youtube, Globe, Zap } from "lucide-react";

const communityStats = [
  { label: "Members", value: "50,000+", icon: Users },
  { label: "Games Created", value: "12,000+", icon: Trophy },
  { label: "Forum Posts", value: "85,000+", icon: MessageSquare },
  { label: "Stars on GitHub", value: "3,200+", icon: Star },
];

const communityChannels = [
  { name: "Discord Server", description: "Join 15,000+ builders chatting, sharing, and collaborating in real-time.", icon: MessageSquare, color: "from-indigo-600 to-indigo-500", members: "15,000+" },
  { name: "YouTube Channel", description: "Tutorials, showcases, and live coding sessions every week.", icon: Youtube, color: "from-red-600 to-red-500", members: "8,500+" },
  { name: "GitHub", description: "Open-source contributions, bug reports, and feature requests.", icon: Github, color: "from-gray-600 to-gray-500", members: "3,200+" },
  { name: "Reddit Community", description: "Share your creations, get feedback, and discuss game design.", icon: Globe, color: "from-orange-600 to-orange-500", members: "22,000+" },
];

const featuredCreators = [
  { name: "PixelMaster99", games: 42, followers: 1200, badge: "Top Creator" },
  { name: "CodeNinja_X", games: 38, followers: 980, badge: "Rising Star" },
  { name: "GameForge_Pro", games: 55, followers: 2100, badge: "Legend" },
  { name: "RetroBuilder", games: 29, followers: 750, badge: "Veteran" },
  { name: "NeonDev", games: 33, followers: 890, badge: "Innovator" },
  { name: "ArcadeKing", games: 47, followers: 1500, badge: "Top Creator" },
];

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Community</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join the <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Redtown 2 Community</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with thousands of game builders, share your creations, and learn from the best.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {communityStats.map((stat) => (
              <Card key={stat.label} className="text-center bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Channels */}
          <h2 className="text-2xl font-bold text-center mb-8">Join Our Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {communityChannels.map((channel) => (
              <Card key={channel.name} className="group hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <div className={`h-2 rounded-t-lg bg-gradient-to-r ${channel.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${channel.color} text-white`}>
                      <channel.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                      <Badge variant="secondary">{channel.members} members</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Creators */}
          <h2 className="text-2xl font-bold text-center mb-8">Featured Creators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {featuredCreators.map((creator) => (
              <Card key={creator.name} className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-destructive flex items-center justify-center text-white font-bold text-lg">
                    {creator.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{creator.name}</span>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{creator.badge}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{creator.games} games · {creator.followers} followers</div>
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

export default Community;
