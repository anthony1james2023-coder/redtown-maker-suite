import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import MothersDay from "./pages/MothersDay";
import FathersDay from "./pages/FathersDay";
import FathersBuilder from "./pages/FathersBuilder";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Changelog from "./pages/Changelog";
import Roadmap from "./pages/Roadmap";
import Blog from "./pages/Blog";
import Tutorials from "./pages/Tutorials";
import Docs from "./pages/Docs";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Owner from "./pages/Owner";
import Community from "./pages/Community";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Press from "./pages/Press";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import Credits from "./pages/Credits";
import Login from "./pages/Login";
import GoogleAccountSelect from "./pages/GoogleAccountSelect";
import Profile from "./pages/Profile";
import Redtown3 from "./pages/Redtown3";
import Welcome from "./pages/Welcome";
import OwnerOnly from "./pages/OwnerOnly";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/home" element={<Index />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/mothers-day" element={<MothersDay />} />
          <Route path="/fathers-day" element={<FathersDay />} />
          <Route path="/fathers-builder" element={<FathersBuilder />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/community" element={<Community />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/press" element={<Press />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-google-redtown2-login" element={<GoogleAccountSelect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/redtown-3" element={<Redtown3 />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/owner-only" element={<OwnerOnly />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
