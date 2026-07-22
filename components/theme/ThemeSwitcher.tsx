"use client";

import { useTheme, type ThemeName } from "./ThemeProvider";
import { Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";

const themeConfig: Record<ThemeName, { label: string; ring: string }> = {
  default: { label: "Default", ring: "ring-brand-500" },
  retro: { label: "Retro", ring: "ring-blue-600" },
  neobrutalism: { label: "Neo", ring: "ring-yellow-400" },
};

export function ThemeSwitcher() {
  const { theme, cycleTheme } = useTheme();
  const config = themeConfig[theme];

  // For the neobrutalism theme, the button itself needs brutalism styling
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2">
      {/* Current theme label */}
      <span
        className={cn(
          "select-none rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
          isNeo && "border-2 border-black bg-white text-black shadow-[3px_3px_0px_0px_black]",
          isRetro && "border border-black bg-[#f5f0e8] text-black",
          !isNeo && !isRetro && "border border-white/20 bg-black/60 text-white/80 backdrop-blur-md"
        )}
      >
        {config.label}
      </span>

      {/* Switcher button */}
      <button
        type="button"
        onClick={cycleTheme}
        title={`Current: ${config.label}. Click to switch theme.`}
        className={cn(
          "group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
          isNeo && "border-[3px] border-black bg-yellow-400 text-black shadow-[4px_4px_0px_0px_black] hover:shadow-[2px_2px_0px_0px_black] hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0",
          isRetro && "border border-black bg-[#f5f0e8] text-black",
          !isNeo && !isRetro && "border border-white/20 bg-black/60 text-white/80 backdrop-blur-md hover:bg-white/20 hover:text-white"
        )}
      >
        <Paintbrush className="h-5 w-5" />
      </button>
    </div>
  );
}
