// Halaman publik dirender dinamis per request (bukan ISR): binding D1 hanya
// tersedia di runtime Worker, tidak saat build/prerender. Dampak: tidak ada
// lagi cache HTML 60 detik — tiap kunjungan membaca D1 (situs CV pribadi,
// bebannya kecil). Tampilan tidak berubah.
export const dynamic = "force-dynamic";

// Pre-render semua locale saat build supaya run pertama (Lighthouse/pengunjung)
// tidak pernah kena render dingin — HTML sudah tersedia sejak deploy.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/app/i18n/routing";
import { getSiteUrl, SITE_DESCRIPTION, SITE_LOGO_URL, SITE_OG_IMAGE } from "@/lib/site-url";
import NavHome from "../views/NavHome";
import Banner from "../views/Banner";
import About from "../views/About";
import Skills from "../views/Skills";
import Education from "../views/Education";
import Works from "../views/Works";
import Projects from "../views/Projects";
import Certificates from "../views/Certificates";
import ContactLazy from "../views/ContactLazy";
import { getProjects } from "@/lib/projects";
import type { ProjectLocale } from "@/app/types/project";

// Hreflang alternates per locale (page-level) — sinyal SEO tambahan selain
// sitemap. Konsisten dengan sitemap.ts: homepage punya id/en/x-default.
// Plus Open Graph/Twitter Card supaya preview share di WA/Telegram/media
// sosial menampilkan logo.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = getSiteUrl();

  return {
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        id: `${siteUrl}/id`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Moh Agus Setiawan",
      url: `${siteUrl}/${locale}`,
      title: "Moh Agus Setiawan | Frontend React Developer",
      description: SITE_DESCRIPTION,
      locale: locale === "id" ? "id_ID" : "en_US",
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: "Moh Agus Setiawan | Frontend React Developer",
      description: SITE_DESCRIPTION,
      images: [SITE_LOGO_URL],
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await getProjects(locale as ProjectLocale);

  return (
    <main className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[44px_44px]" />
      <div className="mx-auto w-full max-w-6xl">
        <Banner />
        <About />
        <Skills />
        <Education />
        <Works />
        <Projects projects={projects} />
        <Certificates />
        <ContactLazy />
        <NavHome />
      </div>
    </main>
  );
}
