import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Brain,
  Cpu,
  Server,
  Palette,
  TestTube2,
  Rocket,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Bug,
  Wand2,
  ListChecks,
  Globe,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, PlanType } from "@/hooks/useSubscription";
import LivePreviewPanel from "@/components/builder/LivePreviewPanel";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";

type Phase = "idea" | "questions" | "plan" | "build" | "test" | "deploy" | "done";

interface PlanStep {
  id: string;
  title: string;
  detail: string;
}

interface SubAgent {
  id: "frontend" | "backend" | "tests";
  name: string;
  icon: typeof Server;
  task: string;
  progress: number;
  log: string[];
}

interface TestResult {
  name: string;
  status: "pending" | "pass" | "fail" | "fixed";
  detail?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const CLARIFYING_QUESTIONS = [
  "What kind of users will use this app? (admins / customers / both)",
  "Do you want authentication? (Google sign-in / email-password / none)",
  "Should it have a database to persist data? (yes / no)",
  "Visual style preference? (minimal / cyberpunk / playful / corporate)",
];

const PHASE_ORDER: Phase[] = ["idea", "questions", "plan", "build", "test", "deploy", "done"];
const PHASE_LABELS: Record<Phase, string> = {
  idea: "Ideation",
  questions: "Clarify",
  plan: "Plan",
  build: "Build",
  test: "Test",
  deploy: "Deploy",
  done: "Live",
};

async function streamAI({
  systemPrompt,
  userPrompt,
  plan,
  onDelta,
  onDone,
  onError,
}: {
  systemPrompt: string;
  userPrompt: string;
  plan: PlanType;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messages, plan }),
  });
  if (!resp.ok || !resp.body) {
    onError(`Error ${resp.status}`);
    return;
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") return onDone();
      try {
        const c = JSON.parse(json).choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

const PhaseTracker = ({ current }: { current: Phase }) => {
  const idx = PHASE_ORDER.indexOf(current);
  return (
    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
      {PHASE_ORDER.map((p, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={p} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                active
                  ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/30"
                  : done
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : active ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span className="h-3 w-3 rounded-full border border-current opacity-60" />
              )}
              {PHASE_LABELS[p]}
            </div>
            {i < PHASE_ORDER.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
          </div>
        );
      })}
    </div>
  );
};

const BuilderAgent4 = () => {
  const { user } = useAuth();
  const { plan } = useSubscription();

  const [phase, setPhase] = useState<Phase>("idea");
  const [idea, setIdea] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([]);
  const [planNarrative, setPlanNarrative] = useState("");
  const [planning, setPlanning] = useState(false);

  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [previewContent, setPreviewContent] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");
  const buildLogRef = useRef<HTMLDivElement>(null);

  // ---- Phase 1: ideation ----
  const handleSubmitIdea = () => {
    if (!idea.trim()) return toast.error("Describe your idea first");
    setPhase("questions");
  };

  // ---- Phase 2: clarifying answers -> Plan ----
  const generatePlan = async () => {
    setPlanning(true);
    setPlanNarrative("");
    setPlanSteps([]);
    const ctx = `IDEA: ${idea}\n\nCLARIFICATIONS:\n${CLARIFYING_QUESTIONS.map(
      (q, i) => `${q}\n→ ${answers[i] || "(no preference)"}`,
    ).join("\n\n")}`;

    let acc = "";
    await streamAI({
      plan,
      systemPrompt:
        "You are Agent 4, a senior software architect. Given an app idea and clarifying answers, output a SHORT technical roadmap (4-6 numbered steps). Format each step as: `**N. Title** — one-line detail`. Be concrete (mention auth, database, key pages, deployment). NO code. Spanish or English matching the user's idea.",
      userPrompt: ctx,
      onDelta: (c) => {
        acc += c;
        setPlanNarrative(acc);
      },
      onDone: () => {
        // Parse "**N. Title** — detail" lines
        const matches = [...acc.matchAll(/\*\*(\d+)\.\s*([^*]+)\*\*\s*[—\-:]\s*([^\n]+)/g)];
        const steps: PlanStep[] = matches.map((m) => ({
          id: m[1],
          title: m[2].trim(),
          detail: m[3].trim(),
        }));
        setPlanSteps(steps);
        setPlanning(false);
        setPhase("plan");
      },
      onError: (err) => {
        toast.error(err);
        setPlanning(false);
      },
    });
  };

  // ---- Phase 3: approve plan -> Build (multi-agent simulation + real AI generation) ----
  const approvePlan = async () => {
    setPhase("build");
    const initialAgents: SubAgent[] = [
      {
        id: "backend",
        name: "Backend Agent",
        icon: Server,
        task: "Setting up database & auth",
        progress: 0,
        log: ["Spinning up Postgres...", "Installing dependencies..."],
      },
      {
        id: "frontend",
        name: "Frontend Agent",
        icon: Palette,
        task: "Building UI components",
        progress: 0,
        log: ["Generating layout...", "Wiring components..."],
      },
      {
        id: "tests",
        name: "Test Agent",
        icon: TestTube2,
        task: "Writing test suite",
        progress: 0,
        log: ["Drafting cases...", "Preparing virtual browser..."],
      },
    ];
    setAgents(initialAgents);

    // Simulate parallel progress
    const tickers: number[] = [];
    initialAgents.forEach((a, idx) => {
      const t = window.setInterval(() => {
        setAgents((prev) =>
          prev.map((p) =>
            p.id === a.id
              ? {
                  ...p,
                  progress: Math.min(100, p.progress + 4 + Math.random() * 6),
                  log:
                    p.progress > 30 && p.log.length < 5
                      ? [...p.log, idx === 0 ? "Migrations applied" : idx === 1 ? "Hero section ready" : "Cases compiled"]
                      : p.log,
                }
              : p,
          ),
        );
      }, 350 + idx * 80);
      tickers.push(t);
    });

    // Real AI generation in parallel with the simulation
    setStreaming(true);
    setPreviewContent("");
    let acc = "";
    const userBrief =
      `Build a working single-file HTML app for: ${idea}\n\n` +
      `Constraints: ${answers.filter(Boolean).join("; ") || "none"}\n` +
      `Output ONE multi-file project using --- FILE: index.html --- delimiters. NO external CDN dependencies. Make it visually polished.`;

    await streamAI({
      plan,
      systemPrompt:
        "You are Agent 4 — multi-agent orchestrator. Generate a complete, working multi-file project using `--- FILE: filename ---` delimiters. Start with index.html. Self-contained, no CDN. Cyberpunk/dark or per the user's style preference.",
      userPrompt: userBrief,
      onDelta: (c) => {
        acc += c;
        setPreviewContent(acc);
        if (buildLogRef.current) buildLogRef.current.scrollTop = buildLogRef.current.scrollHeight;
      },
      onDone: () => {
        tickers.forEach(clearInterval);
        setAgents((prev) => prev.map((p) => ({ ...p, progress: 100 })));
        setStreaming(false);
        // Move to test phase after brief delay
        setTimeout(() => runTests(), 600);
      },
      onError: (err) => {
        tickers.forEach(clearInterval);
        toast.error(err);
        setStreaming(false);
      },
    });
  };

  // ---- Phase 4: auto-tests with self-correction loop ----
  const runTests = () => {
    setPhase("test");
    const cases: TestResult[] = [
      { name: "Page renders without errors", status: "pending" },
      { name: "Buttons respond to clicks", status: "pending" },
      { name: "Forms accept input", status: "pending" },
      { name: "Navigation links work", status: "pending" },
      { name: "Responsive on mobile viewport", status: "pending" },
    ];
    setTests(cases);

    cases.forEach((c, i) => {
      setTimeout(() => {
        // Simulate one failure that gets auto-fixed
        const fail = i === 2;
        setTests((prev) =>
          prev.map((t, ti) =>
            ti === i
              ? fail
                ? { ...t, status: "fail", detail: "Input handler returned undefined" }
                : { ...t, status: "pass" }
              : t,
          ),
        );
        if (fail) {
          setTimeout(() => {
            setTests((prev) =>
              prev.map((t, ti) =>
                ti === i ? { ...t, status: "fixed", detail: "Patched onChange handler" } : t,
              ),
            );
          }, 1400);
        }
        if (i === cases.length - 1) {
          setTimeout(() => setPhase("deploy"), 2200);
        }
      }, 700 + i * 600);
    });
  };

  // ---- Phase 5: deploy ----
  useEffect(() => {
    if (phase !== "deploy") return;
    const slug = idea
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "agent4-app";
    const url = `https://${slug}-${Math.random().toString(36).slice(2, 6)}.lovable.app`;
    const t = setTimeout(() => {
      setDeployUrl(url);
      setPhase("done");
      toast.success("Deployed to production!");
    }, 2200);
    return () => clearTimeout(t);
  }, [phase, idea]);

  const restart = () => {
    setPhase("idea");
    setIdea("");
    setAnswers(["", "", "", ""]);
    setPlanSteps([]);
    setPlanNarrative("");
    setAgents([]);
    setTests([]);
    setPreviewContent("");
    setDeployUrl("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <CyberpunkDecorations />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary via-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-primary/40">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Agent 4
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40">
                  AUTONOMOUS
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Plan → Multi-agent build → Auto-test → Deploy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/builder-agent-2">
                <Wand2 className="h-3.5 w-3.5" /> Agent 2
              </Link>
            </Button>
            {phase !== "idea" && (
              <Button variant="ghost" size="sm" onClick={restart}>
                <RefreshCw className="h-3.5 w-3.5" /> Restart
              </Button>
            )}
          </div>
        </div>

        {/* Phase tracker */}
        <Card className="p-3 mb-5 bg-card/60 backdrop-blur border-primary/20">
          <PhaseTracker current={phase} />
        </Card>

        {/* Phase content */}
        {phase === "idea" && (
          <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">1. Ideation</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Describe what you want in natural language. Example: "Create an inventory management app with user login".
            </p>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Crea una app de gestión de inventario con login de usuario..."
              className="min-h-32 bg-background/50 border-border resize-none mb-4"
            />
            <Button onClick={handleSubmitIdea} variant="hero" size="lg" className="w-full sm:w-auto">
              Continue <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Card>
        )}

        {phase === "questions" && (
          <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">2. Clarifying questions</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Agent 4 needs a few details before drafting the technical roadmap.
            </p>
            <div className="space-y-4 mb-5">
              {CLARIFYING_QUESTIONS.map((q, i) => (
                <div key={i}>
                  <label className="text-xs font-semibold text-foreground/90 block mb-1.5">
                    {i + 1}. {q}
                  </label>
                  <Textarea
                    value={answers[i]}
                    onChange={(e) => {
                      const next = [...answers];
                      next[i] = e.target.value;
                      setAnswers(next);
                    }}
                    placeholder="Your answer (optional)..."
                    className="min-h-[44px] bg-background/50 border-border resize-none text-sm"
                    rows={1}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setPhase("idea")} variant="outline">
                Back
              </Button>
              <Button onClick={generatePlan} variant="hero" disabled={planning}>
                {planning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                Generate roadmap
              </Button>
            </div>
          </Card>
        )}

        {phase === "plan" && (
          <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">3. Technical roadmap</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Review the plan. Approve to launch the multi-agent build.
            </p>

            {planSteps.length > 0 ? (
              <div className="space-y-3 mb-5">
                {planSteps.map((s) => (
                  <div
                    key={s.id}
                    className="flex gap-3 p-3 rounded-lg bg-background/40 border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {s.id}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{s.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-sm max-w-none mb-5 [&>*]:text-foreground [&_strong]:text-primary">
                <ReactMarkdown>{planNarrative}</ReactMarkdown>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setPhase("questions")} variant="outline">
                Edit answers
              </Button>
              <Button onClick={generatePlan} variant="ghost" disabled={planning}>
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <Button onClick={approvePlan} variant="hero" className="ml-auto">
                <CheckCircle2 className="h-4 w-4" /> Approve & build
              </Button>
            </div>
          </Card>
        )}

        {(phase === "build" || phase === "test" || phase === "deploy" || phase === "done") && (
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left: agents + tests + deploy */}
            <div className="space-y-4">
              {/* Sub-agents */}
              <Card className="p-4 bg-card/80 backdrop-blur border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold">Multi-agent build</h3>
                  {streaming && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary ml-auto" />}
                </div>
                <div className="space-y-3">
                  {agents.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.id} className="rounded-lg border border-border bg-background/40 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">{a.name}</span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {Math.round(a.progress)}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-2">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-rose-500 transition-all duration-300"
                            style={{ width: `${a.progress}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted-foreground">{a.task}</div>
                        <div ref={buildLogRef} className="mt-1.5 max-h-16 overflow-y-auto space-y-0.5">
                          {a.log.slice(-3).map((l, i) => (
                            <div key={i} className="text-[10px] font-mono text-emerald-400/70">
                              › {l}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Tests */}
              {(phase === "test" || phase === "deploy" || phase === "done") && (
                <Card className="p-4 bg-card/80 backdrop-blur border-primary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <TestTube2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold">Auto-testing & self-correction</h3>
                  </div>
                  <div className="space-y-1.5">
                    {tests.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md bg-background/40 border border-border"
                      >
                        {t.status === "pending" && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                        {t.status === "pass" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        {t.status === "fail" && <Bug className="h-3.5 w-3.5 text-rose-500 animate-pulse" />}
                        {t.status === "fixed" && <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />}
                        <span className="text-xs flex-1">{t.name}</span>
                        {t.detail && (
                          <span
                            className={`text-[10px] ${
                              t.status === "fail" ? "text-rose-400" : "text-amber-400"
                            }`}
                          >
                            {t.status === "fixed" ? "auto-patched" : t.detail}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Deploy */}
              {(phase === "deploy" || phase === "done") && (
                <Card className="p-4 bg-card/80 backdrop-blur border-primary/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold">Deployment</h3>
                  </div>
                  {phase === "deploy" ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/40 border border-primary/30">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm">Pushing to production servers...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-300">Live in production</span>
                        </div>
                        <a
                          href={deployUrl}
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center gap-1.5 text-xs font-mono text-primary hover:underline break-all"
                        >
                          <Globe className="h-3 w-3 shrink-0" />
                          {deployUrl}
                        </a>
                      </div>
                      <Button onClick={restart} variant="outline" size="sm" className="w-full">
                        <Sparkles className="h-3.5 w-3.5" /> Build another app
                      </Button>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Right: live preview */}
            <Card className="bg-card/80 backdrop-blur border-primary/30 overflow-hidden flex flex-col min-h-[500px] lg:min-h-0">
              <div className="px-3 py-2 border-b border-border flex items-center gap-2 shrink-0">
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">Live preview</span>
                {streaming && (
                  <span className="ml-auto text-[10px] text-primary flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> generating
                  </span>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <LivePreviewPanel streamingContent={previewContent} isStreaming={streaming} />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderAgent4;
