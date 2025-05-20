
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if dark mode is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize based on localStorage or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Update DOM and localStorage
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Sun size={16} className={cn("text-hockey-light-slate", isDarkMode && "opacity-50")} />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon size={16} className={cn("text-hockey-light-slate", !isDarkMode && "opacity-50")} />
    </div>
  );
};

export default ThemeToggle;
