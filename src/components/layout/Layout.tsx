
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
    <div className="min-h-screen bg-gradient-to-b from-hockey-ice to-white dark:from-hockey-slate/90 dark:to-hockey-slate">
      <Navbar />
      <main className={`pt-24 pb-16 px-4 md:px-6 container mx-auto ${getAnimationClass()}`}>
        {children}
      </main>
      <footer className="py-6 border-t border-slate-200 bg-white/70 backdrop-blur-sm dark:bg-hockey-slate/70 dark:border-hockey-slate/50 dark:text-hockey-ice/80">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-hockey-light-slate dark:text-hockey-ice/60">
          <p>© {new Date().getFullYear()} Fantasy Hockey League. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
