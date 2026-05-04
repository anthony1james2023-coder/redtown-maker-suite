import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Eye, Zap, Shield, Layers, RefreshCcw } from "lucide-react";
import heroImage from "@/assets/agent-v2-hero.jpg";
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
                Try Agent v2 <ArrowRight className="h-4 w-4" />
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
          <p>
            Agent v2 also excels at creating high-quality user interfaces. It provides an
            earlier design preview of its progress while building. And it does all this in a
            secure vibe coding environment.
          </p>

          <h3>Realtime app design preview</h3>
          <p>
            This release introduces an industry-first realtime app design preview that renders
            live interfaces as the Agent creates your app or website. Now, the Agent provides
            an earlier design preview before it builds out the full application.
          </p>
          <p>
            One early tester described it as <em>"watching time-lapse photography of your idea
            becoming real software"</em>.
          </p>

          <h3>Improved app creation experience</h3>
          <p>The Agent guides you throughout the ideation process, recommending potential steps to take.</p>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            🛠️ ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Sparkles, title: "Entrada de Idea", desc: "El usuario describe lo que quiere construir en lenguaje cotidiano (ej: \"Crea un clon de Reddit\")." },
              { icon: Layers, title: "Investigación y Planificación", desc: "El agente analiza la solicitud, forma una hipótesis y busca los archivos. Antes de codificar, presenta un plan paso a paso (MVP) para que lo apruebes." },
              { icon: Eye, title: "Diseño en Tiempo Real", desc: "Vista previa de diseño en vivo. El agente genera el frontend primero y permite ver cómo se construye pieza por pieza antes del código lógico." },
              { icon: Zap, title: "Codificación y Configuración", desc: "Con Claude 3.7 Sonnet, escribe frontend y backend, instala dependencias y configura bases de datos y autenticación automáticamente." },
              { icon: RefreshCcw, title: "Autocorrección y Pruebas", desc: "Prueba su propio trabajo en un navegador real. Si encuentra errores, retrocede, replantea y aplica correcciones sin intervención humana." },
              { icon: Shield, title: "Sistema de Checkpoints", desc: "Crea puntos de restauración automáticos para volver a una versión anterior si un cambio no funciona — con chat infinito." },
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
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Autonomía Mejorada:</strong> <span className="text-muted-foreground">trabaja de forma autónoma hasta 200 minutos en tareas complejas.</span></li>
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Vibe Coding:</strong> <span className="text-muted-foreground">permite a non-coders crear software profesional conversando con la IA.</span></li>
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Multi-Framework:</strong> <span className="text-muted-foreground">trabaja con Python, Java, Rust, Go o cualquier framework — incluso importa proyectos de GitHub.</span></li>
            <li className="p-4 rounded-lg bg-card border border-border"><strong className="text-foreground">Checkpoints:</strong> <span className="text-muted-foreground">puntos de restauración automáticos con chat infinito.</span></li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center p-10 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent">
          <h2 className="text-3xl font-bold mb-3">What will you build first?</h2>
          <p className="text-muted-foreground mb-6">Try the new Agent v2 today — completely free.</p>
          <Link to="/builder-agent-2">
            <Button size="lg" className="gap-2">
              Launch Agent v2 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AgentV2;
