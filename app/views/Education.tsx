"use client";

import { useMemo } from "react";
import {
  Calendar,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import type { Education as EducationType } from "@/app/types/site-content";

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ─── Education Card ─────────────────────────────────────────

function EducationCard({ edu, theme }: { edu: EducationType; theme: string }) {
  return (
    <div className={cn(
      "group flex items-start gap-4 rounded-xl p-5 transition-all duration-300 hover:shadow-lg",
      theme === "neobrutalism" && "border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_black] hover:shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5",
      theme === "retro" && "border-2 border-[#6699ff]/20 bg-[#f5f0e8] hover:border-[#6699ff]/50 hover:bg-[#f0ebe0]",
      theme !== "neobrutalism" && theme !== "retro" && "border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]",
    )}>
      {/* Icon */}
      <div className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
        theme === "neobrutalism" && "border-[3px] border-black bg-amber-400",
        theme === "retro" && "border-2 border-[#6699ff] bg-[#6699ff]/10",
        theme !== "neobrutalism" && theme !== "retro" && "border border-white/10 bg-gradient-to-br from-sky-500/20 to-sky-500/5",
      )}>
        <GraduationCap className={cn(
          "h-6 w-6",
          theme === "neobrutalism" && "text-black",
          theme === "retro" && "text-[#6699ff]",
          theme !== "neobrutalism" && theme !== "retro" && "text-sky-400",
        )} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={cn(
              "font-semibold text-base transition-colors",
              theme === "neobrutalism" && "text-black group-hover:text-amber-600",
              theme === "retro" && "text-black group-hover:text-[#6699ff]",
              theme !== "neobrutalism" && theme !== "retro" && "text-white group-hover:text-sky-400",
            )}>
              {edu.school}
            </h3>
            <p className={cn(
              "text-sm font-medium",
              theme === "neobrutalism" && "text-amber-600",
              theme === "retro" && "text-[#6699ff]",
              theme !== "neobrutalism" && theme !== "retro" && "text-sky-400",
            )}>
              {edu.degree} &mdash; {edu.field}
            </p>
          </div>
        </div>

        <div className={cn(
          "mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs",
          theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50"
        )}>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {edu.startDate} - {edu.endDate}
          </span>
          {edu.logo && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {edu.school}
            </span>
          )}
        </div>

        {edu.description && (
          <p className={cn(
            "mt-2 text-sm leading-relaxed pt-2",
            theme === "neobrutalism" && "text-black/70 border-t-2 border-black/10",
            theme === "retro" && "text-black/70 border-t border-[#6699ff]/20",
            theme !== "neobrutalism" && theme !== "retro" && "text-white/60 border-t border-white/10",
          )}>
            {edu.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Education Component ───────────────────────────────

const Education = () => {
  const locale = useLocale();
  const content = useSiteContent("education", locale);
  const { theme } = useTheme();

  const title = useMemo(
    () => getLocalizedContent(content, locale, "title") || "Education",
    [content, locale]
  );
  const description = useMemo(
    () => getLocalizedContent(content, locale, "description") || "My educational background",
    [content, locale]
  );

  const education = useMemo(() => {
    const raw = content.localized?.[locale]?.items ?? content.global?.items;
    return parseJSON<EducationType[]>(raw, []);
  }, [content, locale]);

  return (
    <div className="py-10 md:py-20 px-4 md:px-8" id="education">
      {/* Header - center aligned */}
      <div className="relative flex flex-col items-center text-center mb-12">
        <h1 className={cn(
          "text-center text-4xl underline",
          theme === "neobrutalism" && "text-amber-400",
          theme === "retro" && "text-[#6699ff]",
          theme !== "neobrutalism" && theme !== "retro" && "text-brand-500",
        )}>
          {title}
        </h1>
        <p className={cn(
          "mt-2 max-w-2xl",
          theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50"
        )}>
          {description}
        </p>
        <div className={cn(
          "absolute -top-6 right-0 text-[6rem] md:text-[8rem] font-bold select-none pointer-events-none",
          theme === "neobrutalism" && "text-amber-400/20",
          theme === "retro" && "text-[#6699ff]/15",
          theme !== "neobrutalism" && theme !== "retro" && "text-brand-500/10",
        )}>
          {"</>"}
        </div>
      </div>

      {/* Education Cards Grid */}
      {education.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-4">
          {education.map((edu) => (
            <EducationCard key={edu.id} edu={edu} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;
