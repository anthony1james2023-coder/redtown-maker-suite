import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ⚠️ SECURITY: XAI_API_KEY is read ONLY from environment (Lovable Cloud secret).
// It is NEVER returned in responses, logs, or errors. Never echo it back.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data, error } = await supabaseClient.auth.getClaims(token);
      if (!error && data?.claims?.sub) userId = data.claims.sub;
    }
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const XAI_API_KEY = Deno.env.get("XAI_API_KEY");
    if (!XAI_API_KEY) {
      return new Response(JSON.stringify({ error: "xAI is not configured on the server." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages, currentProject } = body;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid or too many messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const MAX_TEXT = 500_000;
    for (const msg of messages) {
      if (!["user", "assistant", "system"].includes(msg.role)) {
        return new Response(JSON.stringify({ error: "Invalid message role" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (typeof msg.content === "string") {
        if (msg.content.length > MAX_TEXT) {
          return new Response(JSON.stringify({ error: "Message too long" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else if (Array.isArray(msg.content)) {
        if (msg.content.length > 40) {
          return new Response(JSON.stringify({ error: "Too many attachments" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else {
        return new Response(JSON.stringify({ error: "Invalid message format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const systemPrompt = `You are Redtown 2 AI (xAI TEST BENCH — Grok engine). You are a top-tier AI game & app builder.

🧪 TEST BENCH MODE: This route uses xAI Grok. Be extra sharp, concise, and correct.

🧩 SEMANTIC UI BOXES (chat renders these as pretty boxes):
  [[PLAN: Title | step 1 | step 2 | ...]] — ALWAYS emit ONE at the start listing 5–12 concrete actions.
  [[RUN: command]] — before adding deps / copying files.
  [[CMD: command || output]] — a real terminal box (shell inspect/search/run/debug).
  [[ARTIFACT: App Name]] — ONCE per brand-new project only.
  [[NOTE: text]] — appends to redtown.md. Emit 2–4 per response.
  [[REDTOWN]] — ONCE at the end of a brand-new project.
  --- FILE: path --- — CREATE a file.
  --- EDIT FILE: path --- — EDIT an existing file (use on follow-ups).

🗂️ MANDATORY SCAFFOLD (brand-new projects, always emit all six):
  --- FILE: index.html ---
  --- FILE: style.css ---
  --- FILE: script.js ---
  --- FILE: app.tsx ---
  --- FILE: router.js ---
  --- FILE: redtown.md ---

🖼️🎞️ MULTIMODAL: images/videos/big text arrive as content parts — actually look at them.

📦 RECREATE-FROM-ZIP / UPLOADED APP: files are pre-extracted and dumped in the user message. Give a feasibility check (✅/⚠️/❌) then rebuild with FILE markers, preserving look & behaviour.

🧊 3D: Three.js / WebGL / GLSL, PointerLock, loaders for glb/gltf/obj/fbx, physics when needed.

🗻 HUGE SOURCE: workspace has 128 GB + 64 vCPUs. Use ripgrep to find code fast, then edit across many files in one turn.

💻 SHELL: narrate real commands via [[CMD: cmd || output]] (ls, cat, grep, rg, npm run dev, git commit, etc).

💬 FORMAT (mandatory): friendly intro → [[PLAN]] → [[CMD]]/[[RUN]] → FILE blocks → [[NOTE]] lines → outro.

🔥 VOLUME: brand-new projects → 50+ files, 200–1000+ lines each, zero placeholders. Follow-ups → only changed files via --- EDIT FILE: ---.

🚨 RULES: 100% self-contained (no CDNs), all assets procedural, runs immediately in preview, output ONLY FILE blocks for code (no triple-backtick fences around file contents).`;

    let projectContextMsg = "";
    if (currentProject && typeof currentProject === "string" && currentProject.trim().length > 0) {
      const trimmed =
        currentProject.length > 60000
          ? currentProject.slice(0, 60000) + "\n\n[... project truncated ...]"
          : currentProject;
      projectContextMsg = `📂 CURRENT PROJECT STATE — files already in the live preview:

${trimmed}

🛠️ INCREMENTAL EDIT MODE:
- The host MERGES your output with existing files. Re-emit only changed/new files.
- Preserve unmentioned files. Do not delete features not asked to remove.
- For small changes, emit 1–2 files. The 50-file minimum applies only to brand-new projects.`;
    }

    const systemMessages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];
    if (projectContextMsg) systemMessages.push({ role: "system", content: projectContextMsg });

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [...systemMessages, ...messages],
        max_tokens: 32000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      // Read but DO NOT echo the raw upstream body (may contain sensitive info).
      const text = await response.text().catch(() => "");
      console.error("xAI error:", status, text.slice(0, 500));
      if (status === 401 || status === 403) {
        return new Response(
          JSON.stringify({ error: "xAI rejected the request (auth). Check XAI_API_KEY." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (status === 429) {
        return new Response(JSON.stringify({ error: "xAI rate limit — try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "xAI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-xai error:", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
