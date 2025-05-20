import React from "react";
import { NavLink } from "react-router-dom";
import { Trophy, Users, CalendarDays, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const NavItem = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-hockey-blue/10 hover:text-hockey-blue dark:hover:bg-hockey-blue/20",
        isActive
          ? "bg-hockey-blue/10 text-hockey-blue font-medium dark:bg-hockey-blue/20"
          : "text-hockey-slate dark:text-hockey-ice"
      )
    }
  >
    <Icon size={20} className="flex-shrink-0" />
    <span>{label}</span>
  </NavLink>
);

const Navbar = () => {
  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-hockey-slate/90 backdrop-blur-sm border-b border-slate-200 dark:border-hockey-slate/50">
      <div className="container h-full mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-hockey-blue to-hockey-light-blue flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-hockey-slate dark:text-white">
              FantasyHockey
            </span>
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <NavItem to="/" icon={BarChart2} label="Dashboard" />
          <NavItem to="/roster" icon={Users} label="Roster" />
          <NavItem to="/matchup" icon={CalendarDays} label="Matchup" />
          <NavItem to="/standings" icon={Trophy} label="Standings" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="md:hidden flex items-center">
            {/* Mobile menu button would go here */}
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-hockey-slate/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-hockey-slate dark:text-hockey-ice"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
