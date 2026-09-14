"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "default" | "retro" | "neobrutalism";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEMES: ThemeName[] = ["default", "retro", "neobrutalism"];
const STORAGE_KEY = "cv-theme";

function getInitialTheme(): ThemeName {
  if (typeof window === "undefined") return "default";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (THEMES as string[]).includes(stored)) {
      return stored as ThemeName;
    }
  } catch {}
  return "default";
}

export function ThemeProvider({ children, forcedTheme }: { children: ReactNode; forcedTheme?: ThemeName | null }) {
  const [theme, setThemeState] = useState<ThemeName>(() => forcedTheme ?? "default");
  const [mounted, setMounted] = useState<boolean>(forcedTheme ? true : false);

  // When forced, apply the fixed theme on mount and restore the previous one on unmount.
  // Also toggle the .dark class so Tailwind dark: variants activate correctly.
  useEffect(() => {
    if (!forcedTheme) return;
    const previousTheme = document.documentElement.getAttribute("data-theme");
    const previousDark = document.documentElement.classList.contains("dark");
    document.documentElement.setAttribute("data-theme", forcedTheme);
    if (forcedTheme === "default") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return () => {
      if (previousTheme) {
        document.documentElement.setAttribute("data-theme", previousTheme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      if (previousDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
  }, [forcedTheme]);

  // Hydrate from localStorage on mount (only when not forced)
  useEffect(() => {
    if (forcedTheme) return;
    const initial = getInitialTheme();
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
    if (initial === "default") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, [forcedTheme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    if (forcedTheme) return;
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "default") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
  }, [forcedTheme]);

  const cycleTheme = useCallback(() => {
    if (forcedTheme) return;
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  }, [theme, forcedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
