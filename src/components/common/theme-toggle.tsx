"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme, type Theme } from "@/features/theme/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "dropdown" | "pills";
}

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    if (variant === "pills") {
      return (
        <div
          className={cn(
            "h-8 w-52 rounded-xl border border-border/60 bg-muted/20 animate-pulse",
            className
          )}
        />
      );
    }
    return (
      <div
        className={cn(
          "size-9 rounded-xl border border-border/60 bg-muted/30 animate-pulse",
          className
        )}
      />
    );
  }

  if (variant === "pills") {
    return (
      <div
        role="tablist"
        aria-label="Theme selector"
        className={cn(
          "inline-flex items-center rounded-xl border border-border/80 bg-muted/40 p-1 backdrop-blur-xs",
          className
        )}
      >
        <button
          role="tab"
          aria-selected={theme === "light"}
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
            theme === "light"
              ? "bg-card text-foreground shadow-2xs font-semibold ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          )}
        >
          <Sun className="size-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          role="tab"
          aria-selected={theme === "dark"}
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
            theme === "dark"
              ? "bg-card text-foreground shadow-2xs font-semibold ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          )}
        >
          <Moon className="size-3.5 text-indigo-400" />
          <span>Dark</span>
        </button>

        <button
          role="tab"
          aria-selected={theme === "system"}
          type="button"
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
            theme === "system"
              ? "bg-card text-foreground shadow-2xs font-semibold ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-card/40"
          )}
        >
          <Laptop className="size-3.5 text-primary" />
          <span>System</span>
        </button>
      </div>
    );
  }

  // Quick icon toggle: cycle between light -> dark -> system
  const handleCycle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const title =
    theme === "system"
      ? `System Theme (${resolvedTheme})`
      : `${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`;

  return (
    <button
      type="button"
      onClick={handleCycle}
      title={`Current: ${title}. Click to switch theme.`}
      aria-label={`Toggle color theme. Current: ${title}`}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-xl border border-border/80 bg-background/80 text-foreground shadow-2xs hover:bg-muted active:scale-95 transition-all cursor-pointer",
        className
      )}
    >
      {theme === "light" && <Sun className="size-4 text-amber-500 transition-transform" />}
      {theme === "dark" && <Moon className="size-4 text-indigo-400 transition-transform" />}
      {theme === "system" && <Laptop className="size-4 text-primary transition-transform" />}
    </button>
  );
}
