import { Button } from "@/components/ui/button";
import { Zap, Send, Sparkles, ArrowLeft, Loader2, Save, Rocket, Eye, Download, ImagePlus } from "lucide-react";
import BuilderDecorations from "@/components/builder/BuilderDecorations";
import ParticleExplosion from "@/components/builder/ParticleExplosion";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import AIAgentsPanel from "@/components/builder/AIAgentsPanel";
import ProjectsPanel from "@/components/builder/ProjectsPanel";
import LiveCodePanel from "@/components/builder/LiveCodePanel";
import LivePreviewPanel from "@/components/builder/LivePreviewPanel";
import PublishDialog from "@/components/builder/PublishDialog";
import ModelSelector from "@/components/builder/ModelSelector";
import ImageGenerator from "@/components/builder/ImageGenerator";
import FileExplorerSidebar from "@/components/builder/FileExplorerSidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAIBuilding } from "@/hooks/useAIBuilding";
import { supabase } from "@/integrations/supabase/client";
import { downloadGame } from "@/lib/downloadGame";
import { parseMultiFile, combineFiles } from "@/lib/parseMultiFile";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Builder = () => {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("google/gemini-3-flash-preview");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Welcome to **Redtown 2**! 🚀\n\nI'm your AI assistant backed by **∞ INFINITE AIs** working together at light speed!\n\n🤖 **∞** Chat Monitors\n💻 **∞** Coding AIs\n👁️ **∞** Preview Checkers\n🚀 **∞** Publishers\n\n⚡ **10 SECOND BUILDS** - Because infinite power means instant results!\n\nYou can make:\n- 🎮 **3D Games** with real-time preview\n- 📱 Mobile apps\n- 🌐 Websites\n- 🖥️ Host Eaglercraft\n- 🌟 Masterpiece games!\n\n*Powered by Replit, GitHub, Lovable, Cursor, Claude, GPT-5, Gemini, DeepMind, xAI, OpenAI*\n\n**What masterpiece should we build?** 🎨"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectsKey, setProjectsKey] = useState(0);
  const [streamingContent, setStreamingContent] = useState("");
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isBuilding, buildProgress, activeAgents, startBuilding, stopBuilding } = useAIBuilding();
  const [showExplosion, setShowExplosion] = useState(false);
  const prevBuildingRef = useRef(false);

  useEffect(() => {
    if (prevBuildingRef.current && !isBuilding && buildProgress >= 100) {
      setShowExplosion(true);
    }
    prevBuildingRef.current = isBuilding;
  }, [isBuilding, buildProgress]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveProject = async (name: string, description: string, html: string) => {
    try {
      const { error } = await supabase.from("projects").insert({
        name,
        description,
        preview_html: html,
      });
      if (error) throw error;
      toast.success("Project saved!");
      setProjectsKey((k) => k + 1);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };


  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMsg: Message = { role: "user", content: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    let assistantSoFar = "";
    setStreamingContent("");
    
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setStreamingContent(assistantSoFar);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    // Start the AI building visualization
    startBuilding();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg], model: selectedModel }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        if (resp.status === 429) {
          toast.error("Rate limit reached. Please wait a moment and try again.");
        } else if (resp.status === 402) {
          toast.error("AI usage limit reached. Please add credits to continue.");
        } else {
          toast.error(errorData.error || "Something went wrong. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        throw new Error("No response body");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      stopBuilding();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Particle explosion on build complete */}
      <ParticleExplosion active={showExplosion} onComplete={() => setShowExplosion(false)} />
      {/* Decorative background effects */}
      <BuilderDecorations />
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow duration-300">
                <Zap className="h-5 w-5 text-white" />
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-red-600 to-red-500 opacity-0 group-hover:opacity-30 blur-lg transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black leading-tight">
                  Redtown <span className="gradient-text">2</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">AI Builder</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">30 Days Free Trial</span>
              </div>
              <Button 
                variant="hero" 
                size="sm" 
                className="gap-2 shadow-lg shadow-red-500/20"
                onClick={() => setPublishDialogOpen(true)}
              >
                <Rocket className="w-4 h-4" />
                Publish
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/30 hover:bg-primary/10"
                onClick={() => setPreviewDialogOpen(true)}
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        {/* File Explorer Sidebar */}
        <FileExplorerSidebar streamingContent={streamingContent} />
        
        {/* Main builder area */}
        <div className="flex-1 container mx-auto px-4 py-4 flex gap-4 overflow-hidden pb-10">
        {/* Left Column - Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* AI Agents Panel */}
          <AIAgentsPanel 
            isBuilding={isBuilding} 
            buildProgress={buildProgress} 
            activeAgents={activeAgents} 
          />

          {/* Projects Panel */}
          <div className="mb-4">
            <ProjectsPanel key={projectsKey} onNewProject={() => setMessage("")} />
          </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-red-600 to-red-500 text-white"
                    : "glass-card"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-semibold text-red-400">Redtown AI</span>
                  </div>
                )}
                <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "prose-invert" : "prose-invert"}`}>
                  <ReactMarkdown
                    components={{
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt || "AI generated"} className="rounded-lg max-w-full my-2 border border-border/30" />
                      ),
                    }}
                  >{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="glass-card p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Redtown AI</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl p-4 space-y-3">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          {/* Image Generator */}
          <ImageGenerator 
            onImageGenerated={(imageUrl, text) => {
              const imgContent = `🎨 **Imagen Generada:**\n\n![Generated Image](${imageUrl})\n\n${text}`;
              setMessages(prev => [
                ...prev,
                { role: "user", content: "🎨 Generate image" },
                { role: "assistant", content: imgContent },
              ]);
              setStreamingContent(imgContent);
            }}
          />

          {/* Chat Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="🚀 Describe your masterpiece..."
              disabled={isLoading}
              className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-50 transition-all duration-300"
            />
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleSend} 
              className="px-6"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              <p className="text-xs text-muted-foreground">
                Powered by ∞ AIs
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs gap-1"
              onClick={() => {
                const lastAssistant = messages.filter((m) => m.role === "assistant").pop();
                if (lastAssistant) {
                  const files = parseMultiFile(lastAssistant.content);
                  const html = files.length > 0 ? combineFiles(files) : `<html><body><h1>Project Preview</h1><p>${lastAssistant.content.slice(0, 200)}...</p></body></html>`;
                  const name = messages.find((m) => m.role === "user")?.content.slice(0, 50) || "My Project";
                  saveProject(name, lastAssistant.content.slice(0, 200), html);
                }
              }}
            >
              <Save className="w-3 h-3" />
              Save Project
            </Button>
          </div>
        </div>
        </div>

        {/* Right Column - Live Code Panel */}
        <div className="hidden lg:flex flex-col gap-4 w-80 xl:w-96 flex-shrink-0">
          {/* Live 3D Preview */}
          <div className="flex-1 min-h-0">
            <LivePreviewPanel 
              streamingContent={streamingContent} 
              isStreaming={isLoading} 
            />
          </div>
          
          {/* Live Code */}
          <div className="h-64 flex-shrink-0">
            <LiveCodePanel 
              streamingContent={streamingContent} 
              isStreaming={isLoading} 
            />
          </div>
        </div>
        </div>
      </main>

      {/* Publish Dialog */}
      <PublishDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen} />

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
          <DialogHeader className="p-4 pb-2 border-b border-border/50">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-400" />
                Live Preview - What ∞ AIs Built
                {isLoading && (
                  <span className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-xs">
                    <Loader2 className="w-3 h-3 text-green-400 animate-spin" />
                    <span className="text-green-400">Building...</span>
                  </span>
                )}
              </div>
              {streamingContent && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    downloadGame(streamingContent, "Redtown-Game");
                    toast.success("Game downloaded!");
                  }}
                  className="gap-2 border-red-500/30 hover:bg-red-500/10"
                >
                  <Download className="w-4 h-4" />
                  Download Game
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full p-4">
            <LivePreviewPanel 
              streamingContent={streamingContent} 
              isStreaming={isLoading} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Builder;
