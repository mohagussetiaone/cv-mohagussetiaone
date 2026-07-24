"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Award, GraduationCap, House, User, Rocket, BookmarkCheck, ContactRound } from "lucide-react";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";

export default function NavHome() {
  const locale = useLocale();
  const content = useSiteContent("navhome", locale);

  const t = useMemo(
    () => (key: string, fallback: string) =>
      getLocalizedContent(content, locale, key) ?? fallback,
    [content, locale]
  );

  const links = [
    {
      title: t("home", "Home"),
      icon: <House className="h-full w-full" />,
      href: "#home",
    },
    {
      title: t("about", "About"),
      icon: <User className="h-full w-full" />,
      href: "#about",
    },
    {
      title: t("skills", "Skills"),
      icon: <Rocket className="h-full w-full" />,
      href: "#skills",
    },
    {
      title: t("education", "Education"),
      icon: <GraduationCap className="h-full w-full" />,
      href: "#education",
    },
    {
      title: t("portfolio", "Portfolio"),
      icon: <BookmarkCheck className="h-full w-full" />,
      href: "#portfolio",
    },
    {
      title: t("certificates", "Certificates"),
      icon: <Award className="h-full w-full" />,
      href: "#certificates",
    },
    {
      title: t("contact", "Contact"),
      icon: <ContactRound className="h-full w-full" />,
      href: "#contact",
    },
  ];

  return (
    <main>
      <FloatingDock items={links} />
    </main>
  );
}
