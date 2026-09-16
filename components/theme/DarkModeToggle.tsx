"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type DarkModeToggleProps = {
  variant?: "dashboard" | "public";
  className?: string;
};

export function DarkModeToggle({ variant = "dashboard", className }: DarkModeToggleProps) {
  const { isDark, toggleDark } = useTheme();

  if (variant === "dashboard") {
    return (
      <button
        type="button"
        onClick={toggleDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200",
          isDark ? "border-white/10 bg-[#121826] text-white/60 hover:bg-white/5 hover:text-amber-400" : "border-black/10 bg-white text-black/50 hover:bg-black/5 hover:text-amber-500",
          className,
        )}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  // Public variant
  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200",
        isDark ? "border border-white/10 bg-white/5 text-white/70 backdrop-blur-md hover:bg-white/10 hover:text-white" : "border border-black/10 bg-black/5 text-black/60 backdrop-blur-md hover:bg-black/10 hover:text-black",
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
