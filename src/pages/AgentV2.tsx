import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AgentV2 = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl text-center p-10 rounded-2xl border border-primary/40 bg-card/50 backdrop-blur">
          <Construction className="h-14 w-14 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Agent v2 is being built</h1>
          <p className="text-muted-foreground mb-2">
            We're still working on Agent v2 — it's not ready yet.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            How did you get in here early? 👀
          </p>
          <Link to="/home">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgentV2;
