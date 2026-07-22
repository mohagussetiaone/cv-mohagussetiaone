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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("default");
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
  }, []);

  const cycleTheme = useCallback(() => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  }, [theme, setTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

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
