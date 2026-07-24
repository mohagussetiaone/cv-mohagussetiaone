"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import type { ProjectRecord } from "@/app/types/project";

type ProjectsProps = {
  projects: ProjectRecord[];
};

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const locale = useLocale();
  const t = useTranslations("Works");
  const { theme } = useTheme();
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(false);

  const showMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="py-10 md:py-24 px-4 md:px-8" id="portfolio">
      {/* Header - center aligned */}
      <div className="relative flex flex-col items-center text-center mb-12">
        <h1 className={cn(
          "text-center text-4xl underline",
          theme === "neobrutalism" && "text-amber-400",
          theme === "retro" && "text-[#6699ff]",
          theme !== "neobrutalism" && theme !== "retro" && "text-brand-500",
        )}>
          {t("title")}
        </h1>
        <p className={cn(
          "mt-2 max-w-2xl",
          theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50"
        )}>{t("description")}</p>
        <div className={cn(
          "absolute -top-6 right-0 text-[6rem] md:text-[8rem] font-bold select-none pointer-events-none",
          theme === "neobrutalism" && "text-amber-400/20",
          theme === "retro" && "text-[#6699ff]/15",
          theme !== "neobrutalism" && theme !== "retro" && "text-brand-500/10",
        )}>
          {"</>"}
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {projects.slice(0, visibleCount).map((project) => (
          <Link
            key={project.productId}
            href={`/${locale}/project/${project.productId}`}
            className={cn(
              "group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]",
              theme === "neobrutalism" && "border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_black] hover:shadow-[2px_2px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5",
              theme === "retro" && "border-2 border-[#6699ff]/15 bg-[#faf6ef] hover:border-[#6699ff]/40",
              theme !== "neobrutalism" && theme !== "retro" && "border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-brand-500/5",
            )}
          >
            {/* Image */}
            <div className={cn(
              "relative aspect-video w-full overflow-hidden",
              theme === "neobrutalism" ? "bg-amber-200" : theme === "retro" ? "bg-[#6699ff]/10" : "bg-black/40"
            )}>
              {project.image && (
                <Image
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  src={project.image}
                  alt={project.projectName}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <h3 className={cn(
                "font-semibold text-sm transition-colors line-clamp-1",
                theme === "neobrutalism" && "text-black group-hover:text-amber-600",
                theme === "retro" && "text-black group-hover:text-[#6699ff]",
                theme !== "neobrutalism" && theme !== "retro" && "text-white group-hover:text-brand-400",
              )}>
                {project.projectName}
              </h3>
              <p className={cn(
                "text-xs line-clamp-2 leading-relaxed",
                theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50"
              )}>
                {project.description}
              </p>
              {project.technologies.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1 pt-1">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-mono",
                        theme === "neobrutalism" && "border-2 border-black bg-amber-200 text-black font-bold",
                        theme === "retro" && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                        theme !== "neobrutalism" && theme !== "retro" && "bg-white/5 text-white/40",
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className={cn(
                      "text-[10px]",
                      theme === "neobrutalism" ? "text-black/40" : theme === "retro" ? "text-black/40" : "text-white/30"
                    )}>
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Show More */}
      {visibleCount < projects.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={showMore}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm transition-all disabled:opacity-50",
              theme === "neobrutalism" && "border-[3px] border-black bg-amber-400 text-black font-bold shadow-[4px_4px_0px_0px_black] hover:shadow-[2px_2px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5",
              theme === "retro" && "border-2 border-[#6699ff] bg-[#6699ff] text-white hover:bg-[#6699ff]/80",
              theme !== "neobrutalism" && theme !== "retro" && "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
            )}
          >
            {loading ? "Loading..." : t("showMore") || "Show More"}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;
