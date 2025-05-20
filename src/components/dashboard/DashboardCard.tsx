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
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border shadow-sm hover-card transition-colors duration-300",
        className
      )}
    >
      <div className="px-5 py-4 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm">
        <h3 className="font-semibold font-display">
          {title}
        </h3>
        {icon && <div className="text-hockey-light-blue dark:text-hockey-blue">{icon}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default DashboardCard;
