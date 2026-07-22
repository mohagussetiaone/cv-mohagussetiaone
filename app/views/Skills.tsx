"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import type { SkillItem } from "@/app/types/site-content";

type SkillsProps = {
  locale?: string;
};

const Skills = ({ locale: propLocale }: SkillsProps) => {
  const locale = propLocale ?? useLocale();
  const t = useTranslations("Skills");
  const content = useSiteContent("skills", locale);

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
          <h1 className="text-center text-4xl text-brand-500 underline">{t2("title")}</h1>
          <p className="text-white text-center">{t2("description")}</p>
        </div>
        <div className="absolute text-brand-500 -top-4 md:-top-10 right-5 md:right-24 text-[3rem] md:text-[5rem]">{`</>`}</div>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 justify-items-center items-center py-20">
        {skillData.map((skill, index) => (
          <div key={index} className="flex flex-col justify-center items-center col-span-2 md:col-span-1 gap-4">
            <div className="p-8 rounded-full" style={{ backgroundColor: skill.bgColor }}>
              <Image
                src={skill.image}
                alt={skill.name}
                width={30}
                height={30}
                style={{ width: "30px", height: "auto" }}
              />
            </div>
            <h2 className="text-xl text-white">{skill.name}</h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
