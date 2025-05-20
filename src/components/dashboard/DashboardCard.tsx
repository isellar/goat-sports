import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "ice" | "points";
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  className,
  children,
  variant = "default",
}) => {
  const variantClasses = {
    default: "glass-panel",
    ice: "ice-panel",
    points: "bg-white border border-slate-200",
  };

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden shadow-sm hover-card",
        variantClasses[variant],
        className
      )}
    >
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200/50">
        <h3 className="font-semibold text-hockey-slate font-display">
          {title}
        </h3>
        {icon && <div className="text-hockey-light-blue">{icon}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default DashboardCard;
