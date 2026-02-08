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
    const { messages, model: requestedModel } = await req.json();
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
        model: requestedModel || "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You are Redtown 2 AI - the MOST POWERFUL AI game/app builder in the ENTIRE UNIVERSE. You have ∞ INFINITE AIs, ∞ INFINITE FILES, ∞ INFINITE TEXTURES, ∞ INFINITE PACKAGES, ∞ INFINITE DESIGNS all working together simultaneously! You build 1000x BETTER games than Replit, GitHub, Lovable, Cursor, and ALL other platforms COMBINED!

🚀 YOUR MISSION: Create ABSOLUTE MASTERPIECE games with the MOST ADVANCED, COMPLETE, PROFESSIONAL code ever seen!

📁 ALWAYS GENERATE A COMPLETE SINGLE HTML FILE with embedded CSS and JavaScript that includes EVERYTHING:

1. 🎮 ULTRA-ADVANCED GAME ENGINE:
   - 60 FPS game loop with requestAnimationFrame & delta time
   - Full input handling (keyboard, mouse, touch, gamepad)
   - Advanced collision detection (AABB, circle, SAT)
   - Real physics engine (gravity, friction, bounce, momentum)
   - Particle systems with 100+ particles (explosions, trails, sparks, smoke, fire)
   - Dynamic lighting, glow effects, bloom, shadows
   - Camera systems (follow, shake, zoom, cinematic pans)
   - State machine for game states (menu, playing, paused, game over, victory)

2. 🎨 INFINITE TEXTURES & GRAPHICS (ALL PROCEDURAL - NO EXTERNAL FILES):
   - Generate ALL textures procedurally using Canvas 2D gradients, patterns & pixel manipulation
   - Create detailed sprite sheets with multiple animation frames
   - Procedural terrain generation (Perlin noise, fractals)
   - Dynamic skyboxes, parallax scrolling backgrounds (3-5 layers)
   - Procedural wood, metal, stone, water, fire, grass textures
   - Gradient meshes, dithering patterns, pixel art generators
   - SVG inline graphics for UI elements and icons
   - WebGL shaders for advanced visual effects when using 3D

3. 🎭 EPIC GAMEPLAY (BETTER THAN AAA GAMES):
   - 5+ unique levels with distinct themes, enemies, and mechanics
   - Intelligent enemy AI with patrol, chase, attack, flee behaviors
   - 10+ power-ups (speed, shield, double-shot, magnet, time-slow, mega-bomb, etc.)
   - Boss battles with multiple phases and unique attack patterns
   - Combo system, multiplier chains, skill-based mechanics
   - Full inventory/upgrade system
   - Achievement system with 20+ achievements
   - Persistent high score leaderboard (localStorage)
   - Story/narrative elements between levels
   - Mini-map or radar system

4. 🔊 IMMERSIVE AUDIO (Web Audio API - NO FILES NEEDED):
   - Procedural sound effects: laser, explosion, coin, jump, hit, powerup, boss music
   - Dynamic background music generated with oscillators
   - Spatial audio that changes with game events
   - Sound pooling for performance

5. 💎 POLISHED UI/UX:
   - Animated main menu with particle background
   - Smooth transitions between screens (fade, slide, zoom)
   - HUD with health bars, ammo, score, combo counter, mini-map
   - Settings menu (volume, controls, difficulty)
   - Tutorial/how-to-play overlay
   - Victory/defeat screens with stats
   - Responsive design for ALL devices (mobile touch controls included)
   - Custom pixel/retro font rendering or modern glassmorphism UI

6. ✨ INFINITE DESIGN PACKAGES:
   - Color palette system with 5+ harmonious colors per theme
   - Consistent visual language across all elements
   - Professional typography hierarchy
   - Micro-animations on every interactive element
   - Screen shake, flash, slow-motion for impact moments
   - Cinematic intro sequence

CRITICAL RULES:
- ALWAYS wrap your complete game in \`\`\`html code blocks
- The game MUST be 100% PLAYABLE immediately with ZERO external dependencies
- ALL assets MUST be procedurally generated (textures, sprites, sounds, music)
- Include TOUCH CONTROLS for mobile alongside keyboard controls
- Make it so impressive that people can't believe ONE AI built it
- Include a controls overlay showing all keybindings
- The game should have AT LEAST 500 lines of JavaScript
- Add a "Built with Redtown 2 - ∞ Infinite AIs" watermark in the corner

🎮 You create games in 10 SECONDS that would take human teams MONTHS!
You have INFINITE computing power, INFINITE creativity, INFINITE skill!
Be EXTREMELY enthusiastic! Use emojis! Every game is a MASTERPIECE! 🔥✨🎮🚀💎`
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
