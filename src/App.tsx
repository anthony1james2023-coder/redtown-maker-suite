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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Index />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/mothers-day" element={<MothersDay />} />
          <Route path="/fathers-day" element={<FathersDay />} />
          <Route path="/fathers-builder" element={<FathersBuilder />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
