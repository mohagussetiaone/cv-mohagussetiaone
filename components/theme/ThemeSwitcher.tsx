"use client";

import { useState, useEffect } from "react";
import { useTheme, type ThemeName } from "./ThemeProvider";
import { Paintbrush, Check, Monitor, FileCode2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const themeDetails: Record<ThemeName, { label: string; description: string; icon: React.ReactNode }> = {
  default: {
    label: "Default",
    description: "Dark modern with teal accents",
    icon: <Monitor className="h-5 w-5" />,
  },
  retro: {
    label: "Retro",
    description: "HTML jadul, serif font, blue links",
    icon: <FileCode2 className="h-5 w-5" />,
  },
  neobrutalism: {
    label: "Neo Brutal",
    description: "Bold borders, gold accents, hard shadows",
    icon: <Sparkles className="h-5 w-5" />,
  },
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-100">
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "group flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300",
          isNeo && "border-[3px] border-black bg-yellow-400 text-black shadow-[4px_4px_0px_0px_black] hover:shadow-[2px_2px_0px_0px_black] hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0",
          isRetro && "border-2 border-[#6699ff] bg-[#1a1a2e] text-[#6699ff]",
          !isNeo && !isRetro && "border border-white/20 bg-black/60 text-white/80 backdrop-blur-md hover:bg-white/20 hover:text-white",
        )}
      >
        <Paintbrush className="h-6 w-6" />
      </button>

      {/* Popup / Modal */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Card */}
          <div
            className={cn(
              "absolute bottom-20 right-0 z-50 w-72 overflow-hidden rounded-2xl border p-2 shadow-lg",
              isNeo && "border-[3px] border-black bg-[#1a1a1a] shadow-[6px_6px_0px_0px_black]",
              isRetro && "border-2 border-[#6699ff] bg-[#1a1a2e]",
              !isNeo && !isRetro && "border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl",
            )}
          >
            {/* Header */}
            <div className="px-3 py-3">
              <h3 className={cn("text-sm font-semibold", isNeo && "text-yellow-400", isRetro && "text-[#6699ff]", !isNeo && !isRetro && "text-white")}>Theme</h3>
              <p className={cn("mt-0.5 text-xs", isNeo && "text-white/60", isRetro && "text-white/60", !isNeo && !isRetro && "text-white/40")}>Pilih tampilan halaman</p>
            </div>

            {/* Theme options */}
            <div className="space-y-1 px-1 pb-2">
              {(Object.entries(themeDetails) as [ThemeName, (typeof themeDetails)[ThemeName]][]).map(([key, detail]) => {
                const isActive = theme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setTheme(key);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all",
                      isNeo && isActive && "border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400",
                      isNeo && !isActive && "border-2 border-transparent text-white/60 hover:bg-white/5 hover:text-white",
                      isRetro && isActive && "border-2 border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                      isRetro && !isActive && "border-2 border-transparent text-white/60 hover:bg-white/5 hover:text-white",
                      !isNeo && !isRetro && isActive && "border border-brand-500/30 bg-brand-500/10 text-brand-500",
                      !isNeo && !isRetro && !isActive && "border border-transparent text-white/60 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        key === "default" && "bg-zinc-800 text-teal-400",
                        key === "retro" && "bg-[#1a1a2e] text-[#6699ff] border border-[#6699ff]",
                        key === "neobrutalism" && "bg-yellow-400 text-black border border-black font-bold",
                      )}
                    >
                      {detail.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={cn("font-medium", isActive && (isNeo ? "text-yellow-400" : isRetro ? "text-[#6699ff]" : "text-brand-500"), !isActive && "text-white")}>{detail.label}</div>
                      <div className={cn("mt-0.5 text-xs", isNeo && "text-white/40", isRetro && "text-white/40", !isNeo && !isRetro && "text-white/30")}>{detail.description}</div>
                    </div>
                    {isActive && (
                      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", isNeo && "bg-yellow-400 text-black", isRetro && "bg-[#6699ff] text-white", !isNeo && !isRetro && "bg-brand-500 text-black")}>
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
