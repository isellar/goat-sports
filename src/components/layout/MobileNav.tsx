
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Trophy, Users, CalendarDays, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({ 
  to, 
  icon: Icon, 
  label,
  onClick 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string;
  onClick: () => void;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
      "hover:bg-hockey-blue/10 hover:text-hockey-blue",
      isActive 
        ? "bg-hockey-blue/10 text-hockey-blue font-medium" 
        : "text-hockey-slate"
    )}
    onClick={onClick}
  >
    <Icon size={20} className="flex-shrink-0" />
    <span>{label}</span>
  </NavLink>
);

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-slide-in-right">
        <div className="p-4 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-hockey-blue to-hockey-light-blue flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-hockey-slate">FantasyHockey</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={20} className="text-hockey-slate" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem to="/" icon={BarChart2} label="Dashboard" onClick={onClose} />
          <NavItem to="/roster" icon={Users} label="Roster" onClick={onClose} />
          <NavItem to="/matchup" icon={CalendarDays} label="Matchup" onClick={onClose} />
          <NavItem to="/standings" icon={Trophy} label="Standings" onClick={onClose} />
          <NavItem to="/settings" icon={Settings} label="Settings" onClick={onClose} />
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
