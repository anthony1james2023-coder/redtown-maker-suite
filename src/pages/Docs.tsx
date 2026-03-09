import { useState } from "react";
import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunFactsSection from "@/components/FunFactsSection";
import { Badge } from "@/components/ui/badge";
import { docSections } from "@/data/docsContent";
import { Book, ChevronRight, Code } from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState(docSections[0].id);
  const [activeEntry, setActiveEntry] = useState(docSections[0].entries[0].id);

  const currentSection = docSections.find((s) => s.id === activeSection)!;
  const currentEntry = currentSection.entries.find((e) => e.id === activeEntry) || currentSection.entries[0];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = docSections.find((s) => s.id === sectionId)!;
    setActiveEntry(section.entries[0].id);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Book className="w-3 h-3 mr-1" /> Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Documentation</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about building games with Redtown 2.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-1 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4">
                {docSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                        activeSection === section.id
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {section.title}
                    </button>
                    {activeSection === section.id && (
                      <div className="ml-3 mt-1 space-y-0.5">
                        {section.entries.map((entry) => (
                          <button
                            key={entry.id}
                            onClick={() => setActiveEntry(entry.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                              activeEntry === entry.id
                                ? "text-primary bg-primary/5"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <ChevronRight className="w-3 h-3" />
                            {entry.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-8">
                <h2 className="text-2xl font-bold mb-4">{currentEntry.title}</h2>
                <div className="text-muted-foreground whitespace-pre-line mb-6 leading-relaxed">
                  {currentEntry.content}
                </div>
                {currentEntry.code && (
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      <Code className="w-3 h-3" /> Code Example
                    </div>
                    <pre className="bg-background rounded-lg border border-border/50 p-4 overflow-x-auto text-sm font-mono text-foreground">
                      <code>{currentEntry.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <FunFactsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Docs;
