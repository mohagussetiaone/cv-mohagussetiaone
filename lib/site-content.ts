import { prisma } from "@/lib/prisma";
import type { SiteContentSection, SiteContentGrouped, SiteContentMap } from "@/app/types/site-content";

export async function getSiteContentBySection(section: SiteContentSection): Promise<SiteContentGrouped> {
  const rows = await prisma.siteContent.findMany({
    where: { section },
    orderBy: { sortOrder: "asc" },
  });

  const localized: Record<string, SiteContentMap> = {};
  const global: SiteContentMap = {};

  for (const row of rows) {
    if (row.locale) {
      if (!localized[row.locale]) {
        localized[row.locale] = {};
      }
      localized[row.locale][row.key] = row.value;
    } else {
      global[row.key] = row.value;
    }
  }

  return { localized, global };
}

export async function getAllSiteContent(locale: string = "id"): Promise<Record<SiteContentSection, SiteContentGrouped>> {
  const sections: SiteContentSection[] = ["banner", "about", "contact", "navbar", "footer", "navhome"];
  const results: Record<string, SiteContentGrouped> = {};

  for (const section of sections) {
    results[section] = await getSiteContentBySection(section);
  }

  return results as Record<SiteContentSection, SiteContentGrouped>;
}

export function getLocalizedValue(grouped: SiteContentGrouped, key: string, locale: string): string {
  return grouped.localized[locale]?.[key] ?? grouped.localized["id"]?.[key] ?? grouped.global[key] ?? "";
}

export function getGlobalValue(grouped: SiteContentGrouped, key: string): string {
  return grouped.global[key] ?? "";
}
