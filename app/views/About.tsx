"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import ProgrammerImage from "@/app/assets/image/about/Programmer.png";
import { useTranslations, useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

type AboutProps = {
  locale?: string;
};

const About = ({ locale: propLocale }: AboutProps) => {
  const locale = propLocale ?? useLocale();
  const t = useTranslations("About");
  const content = useSiteContent("about", locale);
  const { theme } = useTheme();

  const t2 = useMemo(() => {
    const get = (key: string) => getLocalizedContent(content, locale, key) ?? t(key);
    return get;
  }, [content, locale, t]);

  return (
    <section className="py-10 md:py-20 px-4 md:px-8" id="about">
      {/* Header - Skills style */}
      <div className="relative flex flex-col items-center text-center mb-12">
        <h1 className={cn("text-center text-4xl underline", theme === "neobrutalism" && "text-amber-400", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-500")}>{t2("title")}</h1>
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-6">
        <div className="col-span-6 md:col-span-4">
          <div
            className={cn(
              "rounded-xl p-5",
              theme === "neobrutalism" && "border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_black]",
              theme === "retro" && "border-2 border-[#6699ff]/20 bg-[#f5f0e8]",
              theme !== "neobrutalism" && theme !== "retro" && "bg-black",
            )}
          >
            <div className={cn(theme === "neobrutalism" ? "text-black/70" : theme === "retro" ? "text-black/70" : "text-white")}>
              <span className={cn("text-sm", theme === "neobrutalism" && "text-amber-600", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-500")}>{`<p>`}</span>
              <p className="text-lg indent-8">{t2("description")}</p>
              <p className="text-lg indent-8">{t2("description_1")}</p>
              <span className={cn("text-sm", theme === "neobrutalism" && "text-amber-600", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-500")}>{`<p/>`}</span>
            </div>
          </div>
        </div>
        <div className="col-span-6 md:col-span-2 items-end">
          <Image src={ProgrammerImage} alt="Programmer" width={1300} height={1300} />
        </div>
      </div>
    </section>
  );
};

export default About;
