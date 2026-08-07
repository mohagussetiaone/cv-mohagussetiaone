"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

/** Convenience flags for theme-aware dashboard styling. */
export function useNeo() {
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";
  const cardTheme = isNeo || isRetro;
  return { theme, isNeo, isRetro, cardTheme };
}

/**
 * Neobrutalism class bundles — follow the landing-page patterns
 * (thick black borders, amber fills, hard offset shadows, black text).
 * Only meaningful when applied conditionally for `isNeo`.
 */
export const NEO = {
  /** White card with thick black border + hard offset shadow */
  card: "border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_black]",
  /** Amber hero card (welcome banner / page headers) */
  cardAmber: "border-[3px] border-black bg-amber-400 shadow-[6px_6px_0px_0px_black]",
  /** Primary amber button with press-down interaction */
  btn: "border-2 border-black bg-amber-400 text-black font-bold shadow-[3px_3px_0px_0px_black] hover:shadow-[1px_1px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0",
  /** White outline button */
  btnOutline:
    "border-2 border-black bg-white text-black font-bold shadow-[2px_2px_0px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5",
  /** Input / textarea */
  input:
    "border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_black] placeholder:text-black/40",
  /** Small tag / badge */
  tag: "border-2 border-black bg-amber-200 text-black font-bold",
  /** Dialog surface */
  dialog: "border-[3px] border-black bg-white text-black shadow-[8px_8px_0px_0px_black]",
} as const;
