"use client";

import Link from "next/link";
import { ArrowLeft, Home, Frown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAppLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");
  const locale = useLocale();
  const { setLocale } = useAppLocale();
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  // Home link: ikut locale aktif (mis. /en/xyz → /en)
  const homeHref = `/${locale}`;

  return (
    <div
      className={cn(
        "relative isolate flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center overflow-hidden px-4",
        isNeo && "bg-[#F5F5F5] text-black",
        isRetro && "bg-[#f5f0e8] text-black",
        !isNeo && !isRetro && "bg-dark text-white",
      )}
    >
      {/* ─── Language Switcher (EN/ID) ─── */}
      <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8">
        <div
          className={cn(
            "relative flex items-center rounded-xl p-0.5",
            // Default theme
            !isNeo && !isRetro && "bg-white/5 border border-white/10",
            // Retro theme
            isRetro && "bg-[#ede4d4] border-2 border-[#6699ff]/30",
            // Neo theme
            isNeo && "bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_black]",
          )}
        >
          {/* Sliding indicator */}
          <span
            className={cn(
              "absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-lg transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              locale === "en" ? "left-0.5" : "left-[calc(50%+0.5px)]",
              // Default
              !isNeo && !isRetro && "bg-brand-500/20 border border-brand-500/30",
              // Retro
              isRetro && "bg-[#6699ff]/15 border border-[#6699ff]/40",
              // Neo
              isNeo && "bg-amber-400 border-2 border-black",
            )}
          />

          {/* EN button */}
          <button
            onClick={() => setLocale("en")}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              locale === "en"
                ? isNeo
                  ? "text-black"
                  : isRetro
                    ? "text-[#6699ff]"
                    : "text-brand-500"
                : isNeo
                  ? "text-black/40 hover:text-black"
                  : isRetro
                    ? "text-black/50 hover:text-black"
                    : "text-white/50 hover:text-white/80",
            )}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 9h20" />
              <path d="M12 9v11" />
              <path d="M2 13c3 1.5 7 2 10 2s7-.5 10-2" />
            </svg>
            EN
          </button>

          {/* ID button */}
          <button
            onClick={() => setLocale("id")}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              locale === "id"
                ? isNeo
                  ? "text-black"
                  : isRetro
                    ? "text-[#6699ff]"
                    : "text-brand-500"
                : isNeo
                  ? "text-black/40 hover:text-black"
                  : isRetro
                    ? "text-black/50 hover:text-black"
                    : "text-white/50 hover:text-white/80",
            )}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            ID
          </button>
        </div>
      </div>

      {/* Animated Gradient Background — default theme only */}
      {!isNeo && !isRetro && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-brand-500/5 blur-3xl" />
          {/* Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />
        </div>
      )}

      {/* Retro / Neo decorative accents */}
      {isRetro && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#6699ff]/10" />
        </div>
      )}
      {isNeo && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-16 -top-16 h-64 w-64 rotate-12 border-[3px] border-black/10 bg-amber-400/10" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 -rotate-12 border-[3px] border-black/10 bg-amber-400/10" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Large 404 */}
        <div className="relative">
          <h1 className={cn("select-none text-[12rem] font-bold leading-none tracking-tighter md:text-[18rem]", isNeo && "text-black/10", isRetro && "text-[#6699ff]/10", !isNeo && !isRetro && "text-white/5")}>404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <div className={cn("relative inline-block px-2", isNeo && "border-[3px] border-black bg-amber-400 text-black shadow-[4px_4px_0px_0px_black]", isRetro && "border-2 border-[#6699ff] bg-white px-3 text-[#6699ff]")}>
                <span className={cn("text-sm font-semibold uppercase tracking-[0.3em]", isNeo ? "text-black" : isRetro ? "text-[#6699ff]" : "text-brand-500")}>{t("badge")}</span>
              </div>
              <h2 className={cn("text-3xl font-bold md:text-4xl", isNeo || isRetro ? "text-black" : "text-white")}>{t("title")}</h2>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={cn("mx-auto mt-4 max-w-md text-base md:text-lg", isNeo ? "font-medium text-black" : isRetro ? "text-black" : "text-white/50")}>
          {t("description")}
        </p>

        {/* Divider */}
        <div className={cn("mx-auto mt-8 flex items-center justify-center gap-4", isNeo && "border-b-[3px] border-black pb-1")}>
          <div className={cn("h-px w-12", isNeo || isRetro ? "bg-black/20" : "bg-white/10")} />
          <Frown className={cn("h-5 w-5", isNeo || isRetro ? "text-black/40" : "text-white/30")} />
          <div className={cn("h-px w-12", isNeo || isRetro ? "bg-black/20" : "bg-white/10")} />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={homeHref}
            className={cn(
              "group inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all duration-300",
              isNeo
                ? "border-[3px] border-black bg-amber-400 text-black shadow-[4px_4px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_black]"
                : isRetro
                  ? "border-2 border-[#6699ff] bg-white text-[#6699ff] hover:bg-[#6699ff] hover:text-white"
                  : "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25",
            )}
          >
            <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
            {t("backHome")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className={cn(
              "group inline-flex cursor-pointer items-center gap-2 rounded-xl px-8 py-3 text-sm font-medium transition-all duration-300",
              isNeo
                ? "border-[3px] border-black bg-white text-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_black]"
                : isRetro
                  ? "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white"
                  : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white",
            )}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("backPrevious")}
          </button>
        </div>
      </div>

      {/* Decorative bottom gradient line — default theme only */}
      {!isNeo && !isRetro && <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-brand-500/30 to-transparent" />}
    </div>
  );
}
