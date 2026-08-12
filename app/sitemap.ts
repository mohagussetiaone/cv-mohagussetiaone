import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/app/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

// Locale diambil dari routing.ts (single source of truth, tidak hardcode).
const LOCALES = routing.locales;
const DEFAULT_LOCALE = routing.defaultLocale;

/**
 * Format tanggal ke W3C datetime yang aman untuk sitemap (sitemaps.org):
 * `YYYY-MM-DD` atau `YYYY-MM-DDThh:mm:ss±hh:mm` — TANPA fraksi milidetik.
 * Beberapa parser/validator (termasuk Google Search Console) menolak
 * `<lastmod>` yang mengandung `.mmmZ` (milidetik), sehingga sitemap gagal
 * di-fetch/di-parse ("Couldn't fetch").
 */
function toSitemapDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

// Selalu render fresh dari DB supaya project baru langsung muncul di sitemap
// (tidak di-prerender saat build, jadi build tidak butuh koneksi DB).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Query DB dengan fallback: bila Postgres sempat error/timeout saat di-crawl
  // Google, kita tetap mengembalikan XML yang valid (tanpa URL project) alih-alih
  // response 500 yang membuat Search Console melaporkan "Couldn't fetch".
  let projects: { productId: string; updatedAt: Date }[] = [];
  try {
    projects = await prisma.project.findMany({
      select: {
        productId: true,
        updatedAt: true,
      },
      orderBy: [{ sortOrder: "asc" }, { productId: "asc" }],
    });
  } catch (error) {
    console.warn("[sitemap] Gagal mengambil project dari DB, fallback ke halaman dasar:", error);
  }

  // lastmod homepage = perubahan konten terakhir (project paling baru di-update).
  const lastContentChange = projects.reduce<Date | null>((latest, project) => (latest && latest >= project.updatedAt ? latest : project.updatedAt), null) ?? new Date();

  const homeLanguages = {
    id: `${SITE_URL}/id`,
    en: `${SITE_URL}/en`,
    "x-default": `${SITE_URL}/${DEFAULT_LOCALE}`,
  };

  const homepages: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: toSitemapDate(lastContentChange),
    alternates: { languages: homeLanguages },
  }));

  const projectUrls: MetadataRoute.Sitemap = projects.flatMap((project) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}/project/${project.productId}`,
      lastModified: toSitemapDate(project.updatedAt),
      alternates: {
        languages: {
          id: `${SITE_URL}/id/project/${project.productId}`,
          en: `${SITE_URL}/en/project/${project.productId}`,
        },
      },
    })),
  );

  return [...homepages, ...projectUrls];
}
