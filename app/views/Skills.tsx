"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import type { SkillItem } from "@/app/types/site-content";

type SkillsProps = {
  locale?: string;
};

const Skills = ({ locale: propLocale }: SkillsProps) => {
  const locale = propLocale ?? useLocale();
  const t = useTranslations("Skills");
  const content = useSiteContent("skills", locale);
  const { theme } = useTheme();

  const t2 = useMemo(() => {
    const get = (key: string) => getLocalizedContent(content, locale, key) ?? t(key);
    return get;
  }, [content, locale, t]);

  const skillData: SkillItem[] = useMemo(() => {
    try {
      const raw = content.global?.items;
      return raw ? (JSON.parse(raw) as SkillItem[]) : [];
    } catch {
      return [];
    }
  }, [content.global?.items]);

  return (
    <section className="py-20" id="skills">
      <div className="relative">
        <div className="flex flex-col gap-4 justify-center items-center px-4">
          <h1 className={cn(
            "text-center text-4xl underline",
            theme === "neobrutalism" && "text-amber-400",
            theme === "retro" && "text-[#6699ff]",
            theme !== "neobrutalism" && theme !== "retro" && "text-brand-500",
          )}>{t2("title")}</h1>
          <p className={cn(
            "text-center",
            theme === "neobrutalism" ? "text-black" : theme === "retro" ? "text-black" : "text-white"
          )}>{t2("description")}</p>
        </div>
        <div className={cn(
          "absolute -top-4 md:-top-10 right-5 md:right-24 text-[3rem] md:text-[5rem]",
          theme === "neobrutalism" && "text-amber-400/30",
          theme === "retro" && "text-[#6699ff]/30",
          theme !== "neobrutalism" && theme !== "retro" && "text-brand-500",
        )}>{`</>`}</div>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 justify-items-center items-center py-20">
        {skillData.map((skill, index) => (
          <div key={index} className="flex flex-col justify-center items-center col-span-2 md:col-span-1 gap-4">
            <div className={cn(
              "p-8 rounded-full",
              theme === "neobrutalism" && "border-[3px] border-black shadow-[4px_4px_0px_0px_black]",
              theme === "retro" && "border-2 border-[#6699ff]/30",
            )} style={{ backgroundColor: skill.bgColor }}>
              <Image src={skill.image} alt={skill.name} width={30} height={30} style={{ width: "30px", height: "auto" }} />
            </div>
            <h2 className={cn(
              "text-xl",
              theme === "neobrutalism" ? "text-black font-bold" : theme === "retro" ? "text-black" : "text-white"
            )}>{skill.name}</h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
