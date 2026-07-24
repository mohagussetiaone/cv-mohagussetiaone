"use client";

import { useState, useMemo } from "react";
import { Briefcase, Building2, Calendar, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import type { WorkExperience } from "@/app/types/site-content";

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ─── Experience Card ─────────────────────────────────────────

function ExperienceCard({ exp, index, theme }: { exp: WorkExperience; index: number; theme: string }) {
  const [expanded, setExpanded] = useState(index === 0);

  // ─── Card styling flag ──────────────────────────────────────
  const isCardTheme = theme === "neobrutalism" || theme === "retro";

  const dateLabel = `${exp.startDate} - ${exp.endDate}`;
  const isPresent = exp.endDate === "Present";

  return (
    <div className="group relative pl-8">
      {/* Timeline line */}
      <div className={cn("absolute left-2.75 top-10 bottom-0 w-px", isCardTheme ? (theme === "neobrutalism" ? "bg-black/20" : "bg-[#6699ff]/30") : "bg-linear-to-b from-brand-500/40 via-white/10 to-transparent")} />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 z-10",
          isPresent
            ? isCardTheme
              ? theme === "neobrutalism"
                ? "border-black bg-amber-400"
                : "border-[#6699ff] bg-[#6699ff]/20"
              : "border-brand-500 bg-brand-500/20"
            : isCardTheme
              ? theme === "neobrutalism"
                ? "border-black bg-white"
                : "border-[#6699ff]/50 bg-white"
              : "border-white/20 bg-black/60",
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            isPresent
              ? isCardTheme
                ? theme === "neobrutalism"
                  ? "bg-black animate-pulse"
                  : "bg-[#6699ff] animate-pulse"
                : "bg-brand-400 animate-pulse"
              : isCardTheme
                ? theme === "neobrutalism"
                  ? "bg-black/40"
                  : "bg-[#6699ff]/40"
                : "bg-white/40",
          )}
        />
      </div>

      {/* Content - Card wrapper only for neobrutalism & retro */}
      <div
        className={cn(
          isCardTheme && "rounded-xl p-4 transition-all duration-300 mb-4",
          isCardTheme && isPresent
            ? theme === "neobrutalism"
              ? "border-[3px] border-black bg-amber-100 shadow-[4px_4px_0px_0px_black] hover:shadow-[2px_2px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5"
              : "border-2 border-[#6699ff]/30 bg-[#f5f0e8] hover:border-[#6699ff]/60"
            : isCardTheme
              ? theme === "neobrutalism"
                ? "border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_black] hover:shadow-[2px_2px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5"
                : "border-2 border-[#6699ff]/15 bg-[#faf6ef] hover:border-[#6699ff]/40"
              : "",
        )}
      >
        <div className="flex items-start gap-3">
          {/* Company logo placeholder */}
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              isCardTheme && theme === "neobrutalism" && "border-[3px] border-black bg-amber-400",
              isCardTheme && theme === "retro" && "border-2 border-[#6699ff] bg-[#6699ff]/10",
              !isCardTheme && "border border-white/10 bg-linear-to-br from-brand-500/20 to-brand-500/5",
            )}
          >
            <Building2 className={cn("h-5 w-5", isCardTheme && theme === "neobrutalism" && "text-black", isCardTheme && theme === "retro" && "text-[#6699ff]", !isCardTheme && "text-brand-400")} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={cn("font-semibold text-base", isCardTheme ? "text-black" : "text-white")}>{exp.position}</h3>
                <p className={cn("text-sm font-medium", isCardTheme && theme === "neobrutalism" && "text-amber-600", isCardTheme && theme === "retro" && "text-[#6699ff]", !isCardTheme && "text-brand-400")}>{exp.company}</p>
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className={cn("shrink-0 mt-1 rounded-lg p-1 transition-all", isCardTheme ? "text-black/40 hover:text-black hover:bg-black/10" : "text-white/30 hover:text-white/70 hover:bg-white/5")}
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>

            <div className={cn("mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", isCardTheme ? "text-black/60" : "text-white/50")}>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dateLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {exp.location}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  isCardTheme && theme === "neobrutalism" && "border-2 border-black bg-amber-200 text-black font-bold",
                  isCardTheme && theme === "retro" && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                  !isCardTheme && "border border-white/10 bg-white/5",
                )}
              >
                {exp.type}
              </span>
            </div>

            {expanded && exp.description && (
              <div className={cn("mt-3 pt-3", isCardTheme && theme === "neobrutalism" && "border-t-2 border-black/10", isCardTheme && theme === "retro" && "border-t border-[#6699ff]/20", !isCardTheme && "border-t border-white/10")}>
                <p className={cn("text-sm leading-relaxed whitespace-pre-line", isCardTheme ? "text-black/70" : "text-white/70")}>{exp.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Works Component ────────────────────────────────────

const Works = () => {
  const locale = useLocale();
  const t = useTranslations("Works");
  const content = useSiteContent("works", locale);
  const { theme } = useTheme();

  const t2 = useMemo(() => {
    const get = (key: string) => getLocalizedContent(content, locale, key) ?? t(key);
    return get;
  }, [content, locale, t]);

  const experiences = useMemo(() => {
    const raw = content.localized?.[locale]?.experience ?? content.global?.experience;
    return parseJSON<WorkExperience[]>(raw, []);
  }, [content, locale]);

  return (
    <div className="py-10 md:py-24 px-4 md:px-8" id="experience">
      {/* Header - center aligned */}
      <div className="relative flex flex-col items-center text-center mb-12">
        <h1 className={cn("text-center text-4xl underline", theme === "neobrutalism" && "text-amber-400", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-500")}>{t2("title")}</h1>
        <p className={cn("mt-2 max-w-2xl", theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50")}>{t2("description")}</p>
        <div
          className={cn(
            "absolute -top-6 right-0 text-[6rem] md:text-[8rem] font-bold select-none pointer-events-none",
            theme === "neobrutalism" && "text-amber-400/20",
            theme === "retro" && "text-[#6699ff]/15",
            theme !== "neobrutalism" && theme !== "retro" && "text-brand-500/10",
          )}
        >
          {"</>"}
        </div>
      </div>

      {/* Experience Section */}
      <div>
        {experiences.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className={cn("h-5 w-5", theme === "neobrutalism" && "text-amber-600", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-400")} />
              <h2 className={cn("text-lg font-semibold", theme === "neobrutalism" ? "text-black" : theme === "retro" ? "text-black" : "text-white")}>{t2("experience_label") || "Experience"}</h2>
              <span
                className={cn(
                  "ml-auto text-xs px-2 py-0.5 rounded-full",
                  theme === "neobrutalism" && "border-2 border-black bg-amber-200 text-black font-bold",
                  theme === "retro" && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                  theme !== "neobrutalism" && theme !== "retro" && "text-white/40 bg-white/5",
                )}
              >
                {experiences.length}
              </span>
            </div>
            <div className="space-y-1">
              {experiences.map((exp, i) => (
                <ExperienceCard key={exp.id} exp={exp} index={i} theme={theme} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Works;
