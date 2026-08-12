// ISR 60 detik: HTML di-cache supaya halaman project cepat dibuka (dan enak di-crawl Google),
// tapi tetap fresh ≤1 menit setelah project diubah.
export const revalidate = 60;

// Pre-render semua halaman project (semua locale) saat build — project baru
// yang ditambahkan setelah build tetap di-generate on-demand oleh ISR.
export async function generateStaticParams() {
  let projects: { productId: string }[] = [];
  try {
    projects = await prisma.project.findMany({
      select: { productId: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    // DB tidak tersedia saat build (mis. lokal/CI tanpa DATABASE_URL) → jangan
    // gagalkan build; halaman project tetap di-generate on-demand oleh ISR.
    console.warn("[generateStaticParams] DB tidak tersedia, pre-render project dilewati:", error);
  }

  return projects.flatMap((project) =>
    routing.locales.map((locale) => ({ locale, projectId: project.productId })),
  );
}

import type { Metadata } from "next";
import { cache } from "react";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProjectByProductId } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import { routing } from "@/app/i18n/routing";
import { getSiteUrl, SITE_LOGO_URL } from "@/lib/site-url";
import type { ProjectLocale } from "@/app/types/project";
import ProjectDetail from "../../../views/ProjectDetail";

// Dedupe query antar generateMetadata & render halaman dalam satu request
// (React cache: satu kueri DB per request, bukan dua).
const getProjectCached = cache(getProjectByProductId);

type ShowCaseDetailProps = {
  params: Promise<{
    locale: string;
    projectId: string;
  }>;
};

// Hreflang alternates per project (id/en) + title/description unik per project —
// sinyal SEO tambahan selain sitemap (konsisten: project tidak pakai x-default).
// Plus Open Graph/Twitter Card dengan gambar project (fallback ke logo).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>;
}): Promise<Metadata> {
  const { locale, projectId } = await params;
  const project = await getProjectCached(projectId, locale as ProjectLocale);

  if (!project) {
    return {};
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}/project/${projectId}`;
  const ogImage = project.image ?? SITE_LOGO_URL;
  const ogTitle = `${project.projectName} | Moh Agus Setiawan`;

  return {
    title: project.projectName,
    description: project.description,
    alternates: {
      canonical: pageUrl,
      languages: {
        id: `${siteUrl}/id/project/${projectId}`,
        en: `${siteUrl}/en/project/${projectId}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Moh Agus Setiawan",
      url: pageUrl,
      title: ogTitle,
      description: project.description,
      locale: locale === "id" ? "id_ID" : "en_US",
      images: [{ url: ogImage, alt: project.projectName }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: project.description,
      images: [ogImage],
    },
  };
}

const ShowCaseDetail = async ({ params }: ShowCaseDetailProps) => {
  const { locale, projectId } = await params;
  setRequestLocale(locale);

  if (!projectId) {
    notFound();
  }

  const project = await getProjectCached(projectId, locale as ProjectLocale);

  if (!project) {
    notFound();
  }

  return <ProjectDetail productId={projectId} initialProject={project} />;
};

export default ShowCaseDetail;
