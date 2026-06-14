import { Link } from "react-router-dom";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Rocket, Sparkles, MessageSquare, Eye, Download,
  Layers, Paintbrush, Zap, ArrowRight, CheckCircle2, Lightbulb,
  Monitor, Code2, Play
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Open the Builder",
    description: "Go to the Builder page from the welcome screen or navigation menu. This is where all the magic happens — your AI-powered workspace for creating apps.",
    icon: <Monitor className="w-5 h-5" />,
    tip: "Bookmark the Builder page for quick access!",
  },
  {
    number: 2,
    title: "Describe Your App to the AI",
    description: "Type a prompt describing the app you want to create. Be specific: mention features, style, colors, and functionality. For example: 'Create a todo list app with dark theme and drag-to-reorder'.",
    icon: <MessageSquare className="w-5 h-5" />,
    tip: "The more detail you give, the better the result. Include layout, colors, and user interactions.",
  },
  {
    number: 3,
    title: "Watch the AI Build It",
    description: "The AI generates your app's code in real-time. You'll see the live preview update as it writes HTML, CSS, and JavaScript for your project.",
    icon: <Sparkles className="w-5 h-5" />,
    tip: "Don't interrupt the generation — let it finish for the best result.",
  },
  {
    number: 4,
    title: "Preview Your App",
    description: "Use the live preview panel to see exactly how your app looks and works. Test buttons, interactions, and layout to make sure everything is perfect.",
    icon: <Eye className="w-5 h-5" />,
    tip: "Try resizing the preview to check how it looks on different screen sizes.",
  },
  {
    number: 5,
    title: "Iterate and Refine",
    description: "Not happy with something? Send another message to the AI to tweak colors, add features, fix bugs, or completely redesign sections. Each iteration builds on the previous one.",
    icon: <Paintbrush className="w-5 h-5" />,
    tip: "Ask for specific changes like 'make the header sticky' or 'add a gradient background'.",
  },
  {
    number: 6,
    title: "Download or Publish",
    description: "Once you're satisfied, download your app as a complete project or publish it directly. Your app is ready to share with the world!",
    icon: <Download className="w-5 h-5" />,
    tip: "You can always come back and edit your project later.",
  },
];

const appStructure = [
  { label: "HTML", description: "The skeleton — structure and content of your app", icon: <Code2 className="w-4 h-4" />, color: "text-orange-400" },
  { label: "CSS", description: "The style — colors, fonts, layout, animations", icon: <Paintbrush className="w-4 h-4" />, color: "text-blue-400" },
  { label: "JavaScript", description: "The brain — interactivity, logic, dynamic behavior", icon: <Zap className="w-4 h-4" />, color: "text-yellow-400" },
];

const faq = [
  { q: "Do I need to know how to code?", a: "Not at all! The AI handles all the coding for you. Just describe what you want in plain language and the AI builds it." },
  { q: "What kinds of apps can I make?", a: "Games, tools, dashboards, landing pages, forms, calculators, portfolios — almost anything that runs in a web browser." },
  { q: "Can I edit the code manually?", a: "Yes! The code editor is available in the Builder. You can tweak any part of the generated code if you want finer control." },
  { q: "How does the AI understand my prompts?", a: "The AI is trained on millions of code examples. It interprets your natural language description and translates it into working HTML, CSS, and JavaScript." },
  { q: "Can I use my app on mobile?", a: "Yes. The AI generates responsive designs by default, so your app works on phones, tablets, and desktops." },
];

const Tutorial = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Hero */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <BookOpen className="w-3 h-3 mr-1" /> Tutorial
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How to <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Build Apps with AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn how Redtown 2 works and create your first app in minutes — no coding experience needed.
            </p>
          </div>

          {/* What is Redtown 2 */}
          <Card className="mb-12 bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">What is Redtown 2?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Redtown 2 is an AI-powered app builder that lets you create web applications by simply describing what you want. 
                    You type a prompt, the AI writes the code, and you get a fully working app — all in your browser. 
                    Think of it as having a developer assistant that builds exactly what you imagine, instantly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How an App is Made */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              How an App is Made
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {appStructure.map((item) => (
                <Card key={item.label} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-3 ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              The AI combines all three to generate a complete, working application from your description.
            </p>
          </div>

          {/* Step by step */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Step-by-Step Guide
            </h2>
            <p className="text-muted-foreground mb-8">Follow these steps to create your first app.</p>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <Card key={step.number} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex gap-5">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-primary">{step.icon}</span>
                          <h3 className="text-lg font-bold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground"><strong className="text-foreground">Tip:</strong> {step.tip}</span>
                        </div>
                      </div>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="ml-[30px] mt-4 h-4 border-l-2 border-dashed border-primary/15" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="mt-8 p-4 rounded-xl bg-card/50 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Your progress</span>
                <span className="text-xs text-primary font-mono">Ready to start!</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-primary/10 rounded-lg px-4 bg-card/30">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-primary/10 to-destructive/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Ready to Build?</h2>
              <p className="text-muted-foreground mb-6">Jump into the Builder and create your first app right now.</p>
              <Button asChild variant="hero" size="xl">
                <Link to="/builder">
                  <Rocket className="w-5 h-5 mr-2" />
                  Open the Builder
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tutorial;
