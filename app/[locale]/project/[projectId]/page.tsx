import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { IconBrandFigma, IconBrandGithub } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProjectByProductId } from "@/lib/projects";
import type { ProjectLocale } from "@/app/types/project";

type ShowCaseDetailProps = {
  params: Promise<{
    locale: string;
    projectId: string;
  }>;
};

const ShowCaseDetail = async ({ params }: ShowCaseDetailProps) => {
  const t = await getTranslations("Works");
  const { locale, projectId } = await params;
  const parsedProjectId = Number.parseInt(projectId, 10);

  if (Number.isNaN(parsedProjectId)) {
    notFound();
  }

  const project = await getProjectByProductId(parsedProjectId, locale as ProjectLocale);

  if (!project) {
    notFound();
  }

  return (
    <section className="body-font overflow-hidden p-4">
      <div className="container py-10 mx-auto">
        <div className="mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full md:pr-4">
            <div className="sticky top-4">
              <Image src={project.image || ""} alt={project.projectName} className="w-full h-auto object-cover object-center rounded border border-gray-200" width={500} height={500} />
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
                <Link
                  href={project.urlPreview || ""}
                  target="_blank"
                  className="flex gap-2 mt-6 text-gray-900 dark:text-brand-500 bg-white dark:bg-transparent hover:bg-gray-100 hover:text-black border border-black dark:border-brand-500 py-2 px-8 focus:outline-none rounded text-lg"
                >
                  <Eye className="w-5 h-5 mt-1" />
                  Preview
                </Link>
                {project.githubUrl && (
                  <Link href={project.githubUrl} target="_blank" className="flex gap-2 mt-6 text-white bg-black dark:bg-brand-700 border-0 py-2 px-8 focus:outline-none hover:bg-black/90 hover:text-white rounded text-lg">
                    <IconBrandGithub className="w-5 h-5 mt-1" />
                    Github
                  </Link>
                )}
                {project.figmaUrl && (
                  <Link href={project.figmaUrl} target="_blank" className="flex gap-2 mt-6 text-white bg-black dark:bg-brand-700 border-0 py-2 px-8 focus:outline-none hover:bg-black/90 hover:text-white rounded text-lg">
                    <IconBrandFigma className="w-5 h-5 mt-1" />
                    Figma
                  </Link>
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
