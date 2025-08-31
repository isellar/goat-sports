import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Roster from "./pages/Roster";
import Players from "./pages/Players";
import Matchup from "./pages/Matchup";
import Standings from "./pages/Standings";
import Settings from "./pages/Settings";
import Countries from "./pages/Countries";
import Login from "./pages/Login";
import Layout from "./components/layout/Layout";
import MobileNav from "./components/layout/MobileNav";
import Draft from "./pages/PlayerDraft";
import Trades from "./pages/Trades";
import Waivers from "./pages/Waivers";
import Transactions from "./pages/Transactions";
import League from "./pages/League";

const queryClient = new QueryClient();

const App = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Index />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roster"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Roster />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/players"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Players />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/matchup"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Matchup />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/standings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Standings />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/countries"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Countries />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/draft"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Draft draftId={1} />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trades"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Trades />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/waivers"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Waivers />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Transactions />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/league"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <League />
                        <MobileNav
                          isOpen={mobileNavOpen}
                          onClose={() => setMobileNavOpen(false)}
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
