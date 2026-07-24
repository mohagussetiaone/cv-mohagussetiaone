"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useSiteContent, getLocalizedContent } from "@/hooks/use-site-content";

const Footer = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const content = useSiteContent("footer", locale);

  const copyrightText = useMemo(
    () => getLocalizedContent(content, locale, "copyrightText") ?? "All Rights Reserved.",
    [content, locale]
  );
  const brandName = content.global?.brandName ?? "Moh Agus Setiawan";
  const brandUrl = content.global?.brandUrl ?? "https://mohagussetiaone.my.id";

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <section className="mt-20 pb-24 md:pb-4 px-4">
      <div className="mx-auto max-w-screen-xl">
        <hr className="mb-4 border-gray-200 sm:mx-auto dark:border-gray-700" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-100 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a href={brandUrl} target="_blank" className="hover:underline">
              {brandName}
            </a>
            . {copyrightText}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Footer;
