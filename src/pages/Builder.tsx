import { Button } from "@/components/ui/button";
import { Zap, Send, Sparkles, ArrowLeft, Loader2, Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import AIAgentsPanel from "@/components/builder/AIAgentsPanel";
import ProjectsPanel from "@/components/builder/ProjectsPanel";
import { useAIBuilding } from "@/hooks/useAIBuilding";
import { supabase } from "@/integrations/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Builder = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Welcome to **Redtown 2**! 🚀\n\nI'm your AI assistant backed by **100 AIs** working together. Tell me what app you want to build, and I'll help you create it.\n\n🤖 **10 AIs** monitor our chat\n💻 **50 AIs** code your app\n👁️ **10 AIs** check the preview\n🚀 **30 AIs** handle publishing\n\nYou can make:\n- 🎮 Browser games\n- 📱 Mobile apps\n- 🌐 Websites\n- 🖥️ Host Eaglercraft\n- And so much more!\n\n*Powered by Replit, GitHub, Lovable, Cursor & more*\n\nWhat would you like to build today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectsKey, setProjectsKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isBuilding, buildProgress, activeAgents, startBuilding, stopBuilding } = useAIBuilding();

  const saveProject = async (name: string, description: string, html: string) => {
    try {
      const { error } = await supabase.from("projects").insert({
        name,
        description,
        preview_html: html,
      });
      if (error) throw error;
      toast.success("Project saved!");
      setProjectsKey((k) => k + 1); // Refresh projects list
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMsg: Message = { role: "user", content: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    let assistantSoFar = "";
    
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
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
        body: JSON.stringify({ messages: [...messages, userMsg] }),
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Redtown <span className="gradient-text">2</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">30 Days Free Trial Active</span>
              </div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl overflow-hidden">
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
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
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
        <div className="glass-card p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Describe the app you want to build..."
              disabled={isLoading}
              className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 disabled:opacity-50"
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
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              Powered by Redtown 2 AI • Build anything you can imagine
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs gap-1"
              onClick={() => {
                const lastAssistant = messages.filter((m) => m.role === "assistant").pop();
                if (lastAssistant) {
                  // Extract code blocks from the response
                  const codeMatch = lastAssistant.content.match(/```(?:html)?\n([\s\S]*?)```/);
                  const html = codeMatch?.[1] || `<html><body><h1>Project Preview</h1><p>${lastAssistant.content.slice(0, 200)}...</p></body></html>`;
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
      </main>
    </div>
  );
};

export default Builder;
