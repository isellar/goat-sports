import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const pageTransitions = {
  dashboard: 'animate-fade-in',
  roster: 'animate-fade-up',
  matchup: 'animate-slide-in-right',
  standings: 'animate-fade-up',
  settings: 'animate-fade-in',
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Determine which animation to use based on the current path
  const getAnimationClass = () => {
    const path = location.pathname;
    if (path === '/') return pageTransitions.dashboard;
    if (path.includes('roster')) return pageTransitions.roster;
    if (path.includes('matchup')) return pageTransitions.matchup;
    if (path.includes('standings')) return pageTransitions.standings;
    if (path.includes('settings')) return pageTransitions.settings;
    return 'animate-fade-in'; // Default animation
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className={`flex-1 pt-24 pb-16 px-4 md:px-6 container mx-auto ${getAnimationClass()}`}>
        {children}
      </main>
      <footer className="py-6 border-t border-border bg-background/80 backdrop-blur-sm text-center text-sm">
        <div className="container mx-auto px-4 md:px-6">
          <p>© {new Date().getFullYear()} Goat Sports. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
