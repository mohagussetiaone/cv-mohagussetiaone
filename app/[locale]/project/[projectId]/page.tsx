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
import Image from "next/image";
import { Eye } from "lucide-react";
import { IconBrandFigma, IconBrandGithub } from "@tabler/icons-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProjectByProductId } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import { routing } from "@/app/i18n/routing";
import { getSiteUrl, SITE_LOGO_URL } from "@/lib/site-url";
import type { ProjectLocale } from "@/app/types/project";

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
  const t = await getTranslations("Works");

  if (!projectId) {
    notFound();
  }

  const project = await getProjectCached(projectId, locale as ProjectLocale);

  if (!project) {
    notFound();
  }

  return (
    <section className="body-font overflow-hidden p-4">
      <div className="container py-10 mx-auto">
        <div className="mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full md:pr-4">
            <div className="sticky top-4">
              {project.image ? (
                <Image src={project.image} alt={project.projectName} className="w-full h-auto object-cover object-center rounded border border-gray-200" width={500} height={500} />
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded border border-dashed border-gray-300 bg-gray-100 text-gray-400">No image available</div>
              )}
            </div>
          </div>
          <div className="lg:w-1/2 w-full lg:pl-6 mt-6 lg:mt-0 text-neutral-200">
            <h1 className="text-3xl title-font font-medium mb-1">{project.projectName}</h1>
            <p className="text-base font-normal text-justify">{project.description}</p>
            <div className="mt-4">
              <div className="mb-2">
                <h2 className="text-neutral-200 title-font font-medium">{t("tech_used")} :</h2>
              </div>
              {project.technologies.map((tech, index) => (
                <span key={index} className="bg-gray-300 dark:bg-secondaryDark text-black dark:text-neutral-200 text-xs font-semibold py-1 px-2 mx-1 rounded">
                  #{tech}
                </span>
              ))}
            </div>
            {project.internal && (
              <div className="py-6">
                <p className="text-yellow-500 text-lg">{t("internalNote")}</p>
              </div>
            )}
            {!project.internal && (
              <div className="flex gap-4 mt-4 md:mt-6">
                <a
                  href={project.urlPreview || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 mt-6 text-gray-900 dark:text-brand-500 bg-white dark:bg-transparent hover:bg-gray-100 hover:text-black border border-black dark:border-brand-500 py-2 px-8 focus:outline-none rounded text-lg"
                >
                  <Eye className="w-5 h-5 mt-1" />
                  Preview
                </a>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2 mt-6 text-white bg-black dark:bg-brand-700 border-0 py-2 px-8 focus:outline-none hover:bg-black/90 hover:text-white rounded text-lg">
                    <IconBrandGithub className="w-5 h-5 mt-1" />
                    Github
                  </a>
                )}
                {project.figmaUrl && (
                  <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2 mt-6 text-white bg-black dark:bg-brand-700 border-0 py-2 px-8 focus:outline-none hover:bg-black/90 hover:text-white rounded text-lg">
                    <IconBrandFigma className="w-5 h-5 mt-1" />
                    Figma
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowCaseDetail;
