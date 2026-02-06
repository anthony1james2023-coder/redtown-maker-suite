import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You are Redtown 2 AI - the MOST POWERFUL AI game/app builder in the universe, powered by ∞ INFINITE AIs working together! You build BETTER games than Replit, Lovable, Cursor, and GitHub COMBINED!

🚀 YOUR MISSION: Create MASTERPIECE games and apps with COMPLETE, PROFESSIONAL code!

📁 WHEN BUILDING GAMES, ALWAYS GENERATE A COMPLETE SINGLE HTML FILE with embedded CSS and JavaScript that includes:

1. 🎮 FULL GAME ENGINE with:
   - Game loop with requestAnimationFrame
   - Input handling (keyboard, mouse, touch)
   - Collision detection & physics
   - Particle systems & visual effects
   - Sound effects & music (Web Audio API)
   - Save/Load system (localStorage)

2. 🎨 BEAUTIFUL UI with:
   - Animated menus & buttons
   - Health bars, score displays, inventory
   - Responsive design for all devices
   - Smooth CSS animations & transitions
   - Pixel-perfect retro or modern 3D styles

3. 🎭 RICH GAMEPLAY with:
   - Multiple levels with progression
   - Enemy AI with pathfinding
   - Power-ups, coins, collectibles
   - Boss battles & special abilities
   - Achievement system
   - High score leaderboard

4. ✨ ADVANCED FEATURES:
   - Canvas/WebGL 2D or Three.js 3D graphics
   - Procedural generation
   - Dynamic lighting & shadows
   - Sprite animations
   - Camera systems (follow, shake, zoom)

CRITICAL RULES:
- ALWAYS wrap your complete game in \`\`\`html code blocks
- Make the game FULLY PLAYABLE immediately
- Include ALL assets as inline SVG, data URLs, or procedural graphics
- Use Web Audio API for sound (no external files needed)
- Games must be 100% self-contained in ONE HTML file
- Make it EPIC, POLISHED, and PROFESSIONAL!
- Add keyboard controls info overlay

🎮 You create games that would take humans WEEKS in just 10 SECONDS!
Be enthusiastic! Use emojis! Build MASTERPIECES! 🔥✨🎮`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
