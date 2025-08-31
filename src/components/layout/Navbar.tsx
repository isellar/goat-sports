import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Trophy,
  Users,
  CalendarDays,
  BarChart2,
  Settings,
  UserPlus,
  ArrowRightLeft,
  AlertTriangle,
  FileText,
  Gavel,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
        "hover:bg-hockey-blue/10 hover:text-hockey-blue dark:hover:bg-hockey-blue/20",
        isActive
          ? "bg-hockey-blue/10 text-hockey-blue dark:bg-hockey-blue/20"
          : "text-hockey-slate dark:text-hockey-ice"
      )
    }
  >
    <Icon size={16} className="flex-shrink-0" />
    <span>{label}</span>
  </NavLink>
);

const DropdownNavItem = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) => (
  <DropdownMenuItem asChild>
    <NavLink
      to={to}
      className="flex items-center gap-2 w-full px-2 py-2 text-sm cursor-pointer"
    >
      <Icon size={16} className="flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  </DropdownMenuItem>
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
          <NavItem to="/players" icon={UserPlus} label="Players" />

          {/* Team Management Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-hockey-slate dark:text-hockey-ice hover:bg-hockey-blue/10 hover:text-hockey-blue"
              >
                <ArrowRightLeft size={16} />
                <span>Manage</span>
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownNavItem
                to="/trades"
                icon={ArrowRightLeft}
                label="Trades"
              />
              <DropdownNavItem
                to="/waivers"
                icon={AlertTriangle}
                label="Waivers"
              />
              <DropdownNavItem
                to="/transactions"
                icon={FileText}
                label="Transactions"
              />
              <DropdownMenuSeparator />
              <DropdownNavItem to="/draft" icon={Trophy} label="Draft" />
            </DropdownMenuContent>
          </DropdownMenu>

          <NavItem to="/matchup" icon={CalendarDays} label="Matchup" />
          <NavItem to="/standings" icon={Trophy} label="Standings" />

          {/* More Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-hockey-slate dark:text-hockey-ice hover:bg-hockey-blue/10 hover:text-hockey-blue"
              >
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownNavItem to="/league" icon={Gavel} label="League" />
              <DropdownMenuSeparator />
              <DropdownNavItem
                to="/settings"
                icon={Settings}
                label="Settings"
              />
            </DropdownMenuContent>
          </DropdownMenu>
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
