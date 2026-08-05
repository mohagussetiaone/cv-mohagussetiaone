"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useSectionContent } from "@/hooks/use-section-content";
import { useTheme } from "@/components/theme/ThemeProvider";
import OrbitImages from "@/components/ui/orbit-images";
import { cn } from "@/lib/utils";
import type { SkillItem } from "@/app/types/site-content";

type SkillsProps = {
  locale?: string;
};

const Skills = ({ locale: propLocale }: SkillsProps) => {
  const locale = propLocale ?? useLocale();
  const t = useTranslations("Skills");
  const { theme } = useTheme();
  const content = useSectionContent<SkillItem>("skills", locale);

  const t2 = useMemo(() => {
    const get = (key: string) => content.localized[key] ?? t(key);
    return get;
  }, [content.localized, t]);

  const skillData: SkillItem[] = useMemo(() => content.items, [content.items]);

  const pathColor =
    theme === "neobrutalism"
      ? "rgba(0,0,0,0.25)"
      : theme === "retro"
        ? "rgba(102,153,255,0.30)"
        : "rgba(255,255,255,0.15)";

  const orbitItems = skillData.map((skill) => (
    <div key={skill.id} className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center overflow-hidden rounded-full",
          theme === "neobrutalism" && "border-[3px] border-black shadow-[3px_3px_0px_0px_black]",
          theme === "retro" && "border-2 border-[#6699ff]/30",
        )}
        style={{ backgroundColor: skill.bgColor }}
      >
        {skill.image ? (
          <Image src={skill.image} alt={skill.name} width={34} height={34} style={{ width: "34px", height: "auto" }} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
            {skill.name.charAt(0)}
          </span>
        )}
      </div>
      <span
        className={cn(
          "text-center text-sm",
          theme === "neobrutalism" ? "font-bold text-black" : theme === "retro" ? "font-medium text-black" : "font-medium text-white",
        )}
      >
        {skill.name}
      </span>
    </div>
  ));

  return (
    <section className="py-10 md:py-20 px-4 md:px-8" id="skills">
      {/* Header - center aligned, matching other sections */}
      <div className="relative flex flex-col items-center text-center mb-4">
        <h1 className={cn(
          "text-center text-4xl underline",
          theme === "neobrutalism" && "text-amber-400",
          theme === "retro" && "text-[#6699ff]",
          theme !== "neobrutalism" && theme !== "retro" && "text-brand-500",
        )}>{t2("title")}</h1>
        <p className={cn(
          "mt-2 max-w-2xl",
          theme === "neobrutalism" ? "text-black/60" : theme === "retro" ? "text-black/60" : "text-white/50"
        )}>{t2("description")}</p>
        <div className={cn(
          "absolute -top-6 right-0 text-[6rem] md:text-[8rem] font-bold select-none pointer-events-none",
          theme === "neobrutalism" && "text-amber-400/20",
          theme === "retro" && "text-[#6699ff]/15",
          theme !== "neobrutalism" && theme !== "retro" && "text-brand-500/10",
        )}>
          {"</>"}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-2 md:px-4 py-6 md:py-12">
        <OrbitImages
          images={orbitItems}
          shape="ellipse"
          baseWidth={1400}
          radiusX={560}
          radiusY={190}
          rotation={-8}
          duration={50}
          itemSize={120}
          responsive={true}
          fill
          showPath
          pathColor={pathColor}
          pathWidth={2}
          centerContent={
            <div
              className={cn(
                "pointer-events-none flex h-28 w-28 items-center justify-center rounded-full text-3xl",
                theme === "neobrutalism" && "border-[3px] border-black bg-amber-400 shadow-[5px_5px_0px_0px_black] text-black",
                theme === "retro" && "border-2 border-[#6699ff] bg-white/80 text-[#6699ff]",
                theme !== "neobrutalism" && theme !== "retro" && "border border-white/10 bg-brand-500/10 text-brand-500",
              )}
            >
              {"</>"}
            </div>
          }
        />
      </div>
    </section>
  );
};

export default Skills;
