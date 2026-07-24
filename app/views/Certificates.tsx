"use client";

import { useMemo } from "react";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import type { Certification } from "@/app/types/site-content";

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const Certificates = () => {
  const locale = useLocale();
  const t = useTranslations("Works");
  const content = useSiteContent("certificates", locale);
  const { theme } = useTheme();

  const t2 = useMemo(() => {
    const get = (key: string) => getLocalizedContent(content, locale, key) ?? t(key);
    return get;
  }, [content, locale, t]);

  const certifications = useMemo(() => {
    const raw = content.localized?.[locale]?.items ?? content.global?.items;
    return parseJSON<Certification[]>(raw, []);
  }, [content, locale]);

  if (certifications.length === 0) return null;

  return (
    <div className="py-10 md:py-20 px-4 md:px-8" id="certificates">
      {/* Header - center aligned */}
      <div className="relative flex flex-col items-center text-center mb-12">
        <h1 className={cn("text-center text-4xl underline", theme === "neobrutalism" && "text-amber-400", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-500")}>
          {t2("title") || "Certifications"}
        </h1>
        <p className={cn("mt-2 max-w-2xl", theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50")}>{t2("description") || "Professional certifications"}</p>
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

      {/* Certification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className={cn(
              "group flex items-start gap-4 rounded-xl p-5 transition-all duration-300 hover:shadow-lg",
              theme === "neobrutalism" && "border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_black] hover:shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5",
              theme === "retro" && "border-2 border-[#6699ff]/20 bg-[#f5f0e8] hover:border-[#6699ff]/50",
              theme !== "neobrutalism" && theme !== "retro" && "border border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/5",
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
                theme === "neobrutalism" && "border-[3px] border-black bg-amber-400",
                theme === "retro" && "border-2 border-[#6699ff] bg-[#6699ff]/10",
                theme !== "neobrutalism" && theme !== "retro" && "border border-white/10 bg-linear-to-br from-amber-500/20 to-amber-500/5",
              )}
            >
              <Award className={cn("h-6 w-6", theme === "neobrutalism" && "text-black", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-amber-400")} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "font-semibold text-sm transition-colors",
                  theme === "neobrutalism" && "text-black group-hover:text-amber-600",
                  theme === "retro" && "text-black group-hover:text-[#6699ff]",
                  theme !== "neobrutalism" && theme !== "retro" && "text-white group-hover:text-amber-400",
                )}
              >
                {cert.name}
              </h3>
              <p className={cn("mt-0.5 text-sm", theme === "neobrutalism" && "text-amber-600/80", theme === "retro" && "text-[#6699ff]/80", theme !== "neobrutalism" && theme !== "retro" && "text-amber-400/80")}>{cert.organization}</p>
              <div className={cn("mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50")}>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Issued {cert.issueDate}
                </span>
                {cert.expiryDate && <span>· Expires {cert.expiryDate}</span>}
              </div>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-2 inline-flex items-center gap-1 text-xs transition-colors",
                    theme === "neobrutalism" && "text-black font-bold hover:text-amber-600",
                    theme === "retro" && "text-[#6699ff] hover:text-[#6699ff]/80",
                    theme !== "neobrutalism" && theme !== "retro" && "text-brand-400 hover:text-brand-300",
                  )}
                >
                  Show credential
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;
