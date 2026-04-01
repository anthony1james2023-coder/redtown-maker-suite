import CyberpunkDecorations from "@/components/CyberpunkDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BuilderAgent2 = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberpunkDecorations />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground">Builder Agent 2</h1>
          <p className="text-muted-foreground mt-4">Coming soon.</p>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default BuilderAgent2;
