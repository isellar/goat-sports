
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Roster from "./pages/Roster";
import Players from "./pages/Players";
import Matchup from "./pages/Matchup";
import Standings from "./pages/Standings";
import Settings from "./pages/Settings";
import Layout from "./components/layout/Layout";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";

const queryClient = new QueryClient();

const App = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/roster" element={<Roster />} />
              <Route path="/players" element={<Players />} />
              <Route path="/matchup" element={<Matchup />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
