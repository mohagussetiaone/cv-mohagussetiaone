"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { useTheme } from "@/components/theme/ThemeProvider";

type NavbarData = {
  brandName: string;
  logoImage: string;
  instagramUrl: string;
  githubUrl: string;
  linkedinUrl: string;
};

const defaultNavbar: NavbarData = {
  brandName: "Moh Agus Setiawan",
  logoImage: "/assets/image/logo/mohagus.jpg",
  instagramUrl: "https://www.instagram.com/mohagussetiaone",
  githubUrl: "https://github.com/mohagussetiaone",
  linkedinUrl: "https://www.linkedin.com/in/moh-agus-setiawan-464960167/",
};

const Navbar = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDefaultTheme = theme === "default";
  const isDashboard = pathname.includes("/dashboard");
  const [data, setData] = useState<NavbarData>(defaultNavbar);

  useEffect(() => {
    fetch(`/api/site-content?locale=${locale}`)
      .then((res) => res.json())
      .then((json) => {
        const g = json?.data?.navbar?.global ?? {};
        setData({
          brandName: g.brandName ?? defaultNavbar.brandName,
          logoImage: g.logoImage ?? defaultNavbar.logoImage,
          instagramUrl: g.instagramUrl ?? defaultNavbar.instagramUrl,
          githubUrl: g.githubUrl ?? defaultNavbar.githubUrl,
          linkedinUrl: g.linkedinUrl ?? defaultNavbar.linkedinUrl,
        });
      })
      .catch(() => {});
  }, [locale]);

  if (isDashboard) {
    return null;
  }

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    const newPath = pathWithoutLocale || "/";
    router.push(`/${newLocale}${newPath === "/" ? "" : newPath}`);
  };

  return (
    <nav className="sticky -top-2 z-50">
      <div className={`flex flex-wrap bg-dark border-b border-gray-600 items-center justify-between mx-auto p-4 ${isDefaultTheme ? "bg-[radial-gradient(circle_at_top_left,rgba(18,247,214,0.16),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.14),transparent_20%),linear-gradient(135deg,#292F36_0%,#1F2937_45%,#111827_100%)" : ""}`}>
        <Link href={`/${locale}`} className="flex gap-4 justify-start cursor-pointer">
          <Image src={data.logoImage} alt="Logo" width={40} height={40} className="md:hidden" />
          <h2 className="text-xl hidden md:inline mt-1 text-brand-500">{data.brandName}</h2>
        </Link>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <button onClick={() => handleLanguageChange("en")} className={`text-white ${locale === "en" ? "font-bold" : ""}`}>
              EN
            </button>
            <span className="text-white">|</span>
            <button onClick={() => handleLanguageChange("id")} className={`text-white ${locale === "id" ? "font-bold" : ""}`}>
              ID
            </button>
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
