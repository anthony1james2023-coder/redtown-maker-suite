import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Eye, Zap, Shield, Layers, RefreshCcw } from "lucide-react";
import heroImage from "@/assets/agent-v2-hero.jpg";
import autonomousImage from "@/assets/agent-v2-autonomous.jpg";
import previewImage from "@/assets/agent-v2-preview.jpg";
import checkpointsImage from "@/assets/agent-v2-checkpoints.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AgentV2 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" /> Now available — FREE for everyone
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
            Agent v2 is here
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Smarter with realtime app design preview. More autonomous. Less stuck.
          </p>
          <img
            src={heroImage}
            alt="Agent v2 now available — Smarter with realtime app design preview"
            width={1536}
            height={896}
            className="rounded-2xl border border-border shadow-2xl shadow-primary/20 mx-auto w-full"
          />
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/builder-agent-2">
              <Button size="lg" className="gap-2">
                Try Agent v2 in Builder <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline">Read the docs</Button>
            </Link>
          </div>
        </section>

        {/* Announcement */}
        <section className="prose prose-invert max-w-none mb-16 [&_p]:text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground">
          <p>
            In partnership with Anthropic's Claude 3.7 Sonnet launch, we're excited to announce
            the release of Agent v2 in our early access program.
          </p>
          <p>
            The early access program is available exclusively to users on paid plans who have
            opted in to Explorer Mode. While we're encouraged by initial results, you may
            encounter speed bumps and areas needing improvement as we continue development.
          </p>

          <h2>What's new</h2>

          <h3>A more autonomous Agent</h3>
          <p>
            Agent v2 is fundamentally more autonomous. At each step, it forms a hypothesis,
            searches for the right files, and only starts making changes when it has enough
            information to get the job done.
          </p>
          <p>
            From our testing, v2 is much less likely to get stuck on the same bug. Instead of
            getting caught in loops, it knows when to step back and rethink its approach.
          </p>
          <img
            src={autonomousImage}
            alt="Agent v2 autonomously coding across multiple files"
            width={1280}
            height={768}
            loading="lazy"
            className="rounded-xl border border-border my-6 w-full not-prose"
          />

          <h3>Realtime app design preview</h3>
          <p>
            This release introduces an industry-first realtime app design preview that renders
            live interfaces as the Agent creates your app or website.
          </p>
          <p>
            One early tester described it as <em>"watching time-lapse photography of your idea
            becoming real software"</em>.
          </p>
          <img
            src={previewImage}
            alt="Realtime app design preview rendering live UI as the Agent builds"
            width={1280}
            height={768}
            loading="lazy"
            className="rounded-xl border border-border my-6 w-full not-prose"
          />

          <h3>Improved app creation experience</h3>
          <p>The Agent guides you throughout the ideation process, recommending potential steps to take.</p>
          <img
            src={checkpointsImage}
            alt="Checkpoint timeline — automatic restore points for every change"
            width={1280}
            height={768}
            loading="lazy"
            className="rounded-xl border border-border my-6 w-full not-prose"
          />
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">🛠️ ¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Sparkles, title: "Entrada de Idea", desc: "El usuario describe lo que quiere construir en lenguaje cotidiano (ej: \"Crea un clon de Reddit\")." },
              { icon: Layers, title: "Investigación y Planificación", desc: "El agente analiza, forma una hipótesis y presenta un plan paso a paso (MVP) para que lo apruebes." },
              { icon: Eye, title: "Diseño en Tiempo Real", desc: "Vista previa de diseño en vivo. Genera el frontend primero y permite ver cómo se construye pieza por pieza." },
              { icon: Zap, title: "Codificación y Configuración", desc: "Con Claude 3.7 Sonnet, escribe frontend y backend, instala dependencias y configura DB y auth automáticamente." },
              { icon: RefreshCcw, title: "Autocorrección y Pruebas", desc: "Prueba su trabajo en un navegador real. Si encuentra errores, retrocede y corrige sin intervención humana." },
              { icon: Shield, title: "Sistema de Checkpoints", desc: "Puntos de restauración automáticos para volver a una versión anterior — con chat infinito." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors">
                <item.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">✨ Características Clave</h2>
          <ul className="space-y-3">
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Autonomía Mejorada:</strong> <span className="text-muted-foreground">trabaja autónomamente hasta 200 minutos en tareas complejas.</span></li>
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Vibe Coding:</strong> <span className="text-muted-foreground">non-coders pueden crear software profesional conversando con la IA.</span></li>
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Multi-Framework:</strong> <span className="text-muted-foreground">Python, Java, Rust, Go o cualquier framework — incluso importa proyectos de GitHub.</span></li>
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Checkpoints:</strong> <span className="text-muted-foreground">puntos de restauración automáticos con chat infinito.</span></li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center p-10 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent">
          <h2 className="text-3xl font-bold mb-3">What will you build first?</h2>
          <p className="text-muted-foreground mb-6">Try the new Agent v2 today — completely free.</p>
          <Link to="/builder-agent-2">
            <Button size="lg" className="gap-2">
              Launch Builder Agent 2 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AgentV2;
