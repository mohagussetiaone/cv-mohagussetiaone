"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import MohAgusImage from "@/app/assets/image/profile/mohagus.jpeg";
import Link from "next/link";
import { Mail, MapPin, Briefcase, Link2, Download, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewritter-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useTranslations, useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";
import { useTheme } from "@/components/theme/ThemeProvider";

const handleDownload = async (cvUrl: string) => {
  try {
    const response = await fetch(cvUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = cvUrl.split("/").pop() || "CV";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

type BannerProps = {
  locale?: string;
};

const Banner = ({ locale: propLocale }: BannerProps) => {
  const locale = propLocale ?? useLocale();
  const t = useTranslations("Banner");
  const content = useSiteContent("banner", locale);
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  const t2 = useMemo(() => {
    const get = (key: string) => getLocalizedContent(content, locale, key) ?? t(key);
    const getGlobal = (key: string) => content.global?.[key];
    return { get, getGlobal };
  }, [content, locale, t]);

  const words = [
    { text: "Front End", className: "text-brand-500" },
    { text: "Developer.", className: "text-brand-500" },
  ];

  const email = t2.getGlobal("email") ?? "mohagussetiaone@gmail.com";
  const address = t2.getGlobal("address") ?? "Menteng dalam, Kec tebet, Kota Jakarta Selatan";
  const jobTitle = t2.getGlobal("jobTitle") ?? "Front End React Developer";
  const websiteUrl = t2.getGlobal("websiteUrl") ?? "https://mohagussetiaone.my.id";
  const whatsappNumber = t2.getGlobal("whatsappNumber") ?? "6287885159098";
  const yearsExperience = t2.getGlobal("yearsExperience") ?? "2+";
  const programmingLanguages = t2.getGlobal("programmingLanguages") ?? "2";
  const devProjects = t2.getGlobal("developmentProjects") ?? "8+";
  const cvFileUrl = t2.getGlobal("cvFileUrl") ?? "/CV_2026021211100687.pdf";

  const profileCard = (
    <div className={`${isNeo ? "border-[3px] border-black bg-yellow-400 p-6 shadow-[6px_6px_0px_0px_black] rounded-tl-[8rem] rounded-br-[8rem]" : isRetro ? "border border-gray-300 p-6 rounded-tl-[8rem] rounded-br-[8rem]" : "border border-gray-500 p-6 rounded-tl-[8rem] rounded-br-[8rem]"}`}>
      <div className="flex flex-col items-center justify-center mx-auto py-6">
        <Image src={MohAgusImage} width={220} height={180} alt="BannerImage.jpg" className="object-contain rounded-full" />
      </div>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex gap-2 items-center">
          <Mail className="w-5 h-5 text-brand-500 shrink-0" />
          <span className="text-white text-sm">{email}</span>
        </div>
        <div className="flex gap-2 items-center">
          <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
          <span className="text-white text-sm">{address}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Briefcase className="w-5 h-5 text-brand-500 shrink-0" />
          <span className="text-white text-sm">{jobTitle}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Link2 className="w-5 h-5 text-brand-500 shrink-0" />
          <span className="text-white text-sm break-all">{websiteUrl}</span>
        </div>
      </div>
      <Button onClick={() => handleDownload(cvFileUrl)} className={`${isNeo ? "border-[3px] border-black bg-yellow-400 text-black shadow-[4px_4px_0px_0px_black] hover:bg-yellow-300" : isRetro ? "border border-gray-300 bg-white text-black hover:bg-gray-100" : "bg-white hover:bg-gray-300 text-black"} p-4 rounded-full text-lg my-4`}>
        Download CV
        <Download className="w-6 h-6 ml-2" />
      </Button>
    </div>
  );

  return (
    <section className="w-full py-4 md:pb-20 md:px-8" id="home">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-1 p-4 md:pr-10">
          {isNeo || isRetro ? profileCard : <HoverBorderGradient>{profileCard}</HoverBorderGradient>}
        </div>
        <div className="col-span-3 md:col-span-2 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-4 items-start justify-start md:mx-6">
              <span className="text-sm text-brand-500">{"<h1>"}</span>
              <h1 className="text-5xl text-white">{t2.get("greeting")}</h1>
              <h1 className="text-4xl text-white">{t2.get("name")}</h1>
              <TypewriterEffect words={words} />
              <span className="text-sm text-brand-500">{"<h1/>"}</span>
              <div>
                <span className="text-sm text-brand-500">{"<p>"}</span>
                <p className="text-lg text-white">{t2.get("description")}</p>
                <span className="text-sm text-brand-500">{"<p/>"}</span>
              </div>
              <div className="py-4 text-brand-500">
                <Link href={`https://wa.me/${whatsappNumber}`} className="flex gap-2 text-3xl" target="_blank">
                  {t2.get("lets_talk")}
                  <span className={`flex flex-col items-center justify-center rounded-full px-2 ${isNeo ? "border-2 border-black bg-yellow-400" : isRetro ? "bg-white border border-gray-300" : "bg-black"}`}>
                    <Phone className="w-6 h-6" />
                  </span>
                </Link>
              </div>
            </div>
            <div className={`flex w-full md:w-auto flex-col gap-8 md:gap-10 items-start md:items-center justify-start h-auto self-center p-6 ${isNeo ? "border-2 border-black bg-yellow-400" : isRetro ? "bg-white border border-gray-300" : "bg-black rounded-3xl"}`}>
              <div className="flex gap-3">
                <div className="h-full flex justify-center items-center">
                  <h1 className="text-4xl text-brand-500">{yearsExperience}</h1>
                </div>
                <div className="flex flex-col text-white">
                  <h2>{t2.get("years")}</h2>
                  <h2>{t2.get("experience")}</h2>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-full flex justify-center items-center">
                  <h1 className="text-4xl text-brand-500">{programmingLanguages}</h1>
                </div>
                <div className="flex flex-col text-white">
                  <h2>{t2.get("programming")}</h2>
                  <h2>{t2.get("language")}</h2>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-full flex justify-center items-center">
                  <h1 className="text-4xl text-brand-500">{devProjects}</h1>
                </div>
                <div className="flex flex-col text-white">
                  <h2>{t2.get("development")}</h2>
                  <h2>{t2.get("project")}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
