import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import GamesGallery from "@/components/GamesGallery";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <div className="flex justify-center gap-4 py-8 flex-wrap">
          <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-4">
            <Link to="/mothers-day">🌸 Mother's Day Special</Link>
          </Button>
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-4">
            <Link to="/fathers-day">🏀 Father's Day Special</Link>
          </Button>
        </div>
        <FeaturesSection />
        <GamesGallery />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
