"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "@/app/i18n/routing";
import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSiteContent } from "@/hooks/use-site-content";
import { useAppLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const locale = useLocale();
  const { setLocale } = useAppLocale();
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDefaultTheme = theme === "default";
  const isDashboard = pathname.includes("/dashboard");
  const content = useSiteContent("navbar", locale);

  const data = useMemo(() => ({
    brandName: content.global?.brandName ?? "Moh Agus Setiawan",
    logoImage: content.global?.logoImage ?? "/assets/image/logo/mohagus.jpg",
    instagramUrl: content.global?.instagramUrl ?? "https://www.instagram.com/mohagussetiaone",
    githubUrl: content.global?.githubUrl ?? "https://github.com/mohagussetiaone",
    linkedinUrl: content.global?.linkedinUrl ?? "https://www.linkedin.com/in/moh-agus-setiawan-464960167/",
  }), [content.global]);

  if (isDashboard) {
    return null;
  }

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <nav className="sticky -top-2 z-50">
      <div
        className={`flex flex-wrap bg-dark border-b border-gray-600 items-center justify-between mx-auto p-4 ${isDefaultTheme ? "bg-[radial-gradient(circle_at_top_left,rgba(18,247,214,0.16),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.14),transparent_20%),linear-gradient(135deg,#292F36_0%,#1F2937_45%,#111827_100%)" : ""}`}
      >
        <Link href={`/${locale}`} className="flex gap-3 justify-start items-center cursor-pointer">
          <Image src={data.logoImage} alt="Logo" width={36} height={36} className="rounded-full object-cover w-9 h-9" />
          <h2 className={cn("text-lg md:text-xl font-semibold", theme === "neobrutalism" && "text-amber-400", theme === "retro" && "text-[#6699ff]", theme !== "neobrutalism" && theme !== "retro" && "text-brand-500")}>{data.brandName}</h2>
        </Link>
        <div className="flex gap-6">
          {/* ─── Language Switcher ─── */}
          <div className="flex items-center">
            <div
              className={cn(
                "relative flex items-center rounded-xl p-0.5",
                // Default theme
                theme === "default" && "bg-white/5 border border-white/10",
                // Retro theme
                theme === "retro" && "bg-[#ede4d4] border-2 border-[#6699ff]/30",
                // Neo theme
                theme === "neobrutalism" && "bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_black]",
              )}
            >
              {/* Sliding indicator */}
              <span
                className={cn(
                  "absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-lg transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  locale === "en" ? "left-0.5" : "left-[calc(50%+0.5px)]",
                  // Default
                  theme === "default" && "bg-brand-500/20 border border-brand-500/30",
                  // Retro
                  theme === "retro" && "bg-[#6699ff]/15 border border-[#6699ff]/40",
                  // Neo
                  theme === "neobrutalism" && "bg-amber-400 border-2 border-black",
                )}
              />

              {/* EN button */}
              <button
                onClick={() => handleLanguageChange("en")}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  locale === "en"
                    ? [
                        theme === "default" && "text-brand-500",
                        theme === "retro" && "text-[#6699ff]",
                        theme === "neobrutalism" && "text-black",
                      ]
                    : [
                        theme === "default" && "text-white/50 hover:text-white/80",
                        theme === "retro" && "text-black/50 hover:text-black",
                        theme === "neobrutalism" && "text-black/40 hover:text-black",
                      ],
                )}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 9h20" />
                  <path d="M12 9v11" />
                  <path d="M2 13c3 1.5 7 2 10 2s7-.5 10-2" />
                </svg>
                EN
              </button>

              {/* ID button */}
              <button
                onClick={() => handleLanguageChange("id")}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  locale === "id"
                    ? [
                        theme === "default" && "text-brand-500",
                        theme === "retro" && "text-[#6699ff]",
                        theme === "neobrutalism" && "text-black",
                      ]
                    : [
                        theme === "default" && "text-white/50 hover:text-white/80",
                        theme === "retro" && "text-black/50 hover:text-black",
                        theme === "neobrutalism" && "text-black/40 hover:text-black",
                      ],
                )}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
                ID
              </button>
            </div>
          </div>
          <div className="md:w-auto" id="navbar-default">
            <ul className="font-medium flex gap-2 rounded-lg md:flex-row md:space-x-4 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li className="flex gap-2">
                <Link href={data.instagramUrl} className="flex gap-2 text-white rounded" aria-current="page" target="_blank">
                  <IconBrandInstagram className="text-brand-500" />
                  <span className="hidden md:inline">Instagram</span>
                </Link>
              </li>
              <li className="flex gap-2">
                <Link href={data.githubUrl} className="flex gap-2 text-white rounded" target="_blank">
                  <IconBrandGithub className="text-brand-500" />
                  <span className="hidden md:inline">Github</span>
                </Link>
              </li>
              <li className="flex gap-2">
                <Link href={data.linkedinUrl} className="flex gap-2 text-white rounded" target="_blank">
                  <IconBrandLinkedin className="text-brand-500" />
                  <span className="hidden md:inline">Linkedin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
