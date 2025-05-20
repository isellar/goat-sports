import React from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun
        size={16}
        className={cn(
          "text-hockey-light-slate",
          resolvedTheme === "dark" && "opacity-50"
        )}
      />
      <Switch
        checked={resolvedTheme === "dark"}
        onCheckedChange={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        aria-label="Toggle dark mode"
      />
      <Moon
        size={16}
        className={cn(
          "text-hockey-light-slate",
          resolvedTheme !== "dark" && "opacity-50"
        )}
      />
    </div>
  );
};

export default ThemeToggle;
