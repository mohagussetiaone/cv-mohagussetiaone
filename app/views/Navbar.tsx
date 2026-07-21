"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import LogoImg from "@/app/assets/image/logo/mohagus.jpg";
import { useLocale } from "next-intl";

const Navbar = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

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
      <div className="flex flex-wrap bg-dark border-b border-gray-600 items-center justify-between mx-auto p-4 bg-[radial-gradient(circle_at_top_left,rgba(18,247,214,0.16),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.14),transparent_20%),linear-gradient(135deg,#292F36_0%,#1F2937_45%,#111827_100%)]">
        <Link href={`/${locale}`} className="flex gap-4 justify-start cursor-pointer">
          <Image src={LogoImg} alt="Logo" width={40} height={40} className="md:hidden" />
          <h2 className="text-xl hidden md:inline mt-1 text-brand-500">Moh Agus Setiawan</h2>
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
                <Link href="https://www.instagram.com/mohagussetiaone" className="flex gap-2 text-white rounded" aria-current="page" target="_blank">
                  <IconBrandInstagram className="text-brand-500" />
                  <span className="hidden md:inline">Instagram</span>
                </Link>
              </li>
              <li className="flex gap-2">
                <Link href="https://github.com/mohagussetiaone" className="flex gap-2 text-white rounded" target="_blank">
                  <IconBrandGithub className="text-brand-500" />
                  <span className="hidden md:inline">Github</span>
                </Link>
              </li>
              <li className="flex gap-2">
                <Link href="https://www.linkedin.com/in/moh-agus-setiawan-464960167/" className="flex gap-2 text-white rounded" target="_blank">
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
