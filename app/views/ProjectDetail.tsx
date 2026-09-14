"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { IconBrandFigma, IconBrandGithub } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectRecord } from "@/app/types/project";

type ProjectDetailProps = {
  productId: string;
  initialProject: ProjectRecord;
};

// Parse githubUrl: could be plain URL or JSON {"frontend":"...","backend":"..."}
const parseGithubUrls = (raw: string | null | undefined): { frontend: string; backend: string } => {
  if (!raw) return { frontend: "", backend: "" };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && (parsed.frontend || parsed.backend)) {
      return { frontend: parsed.frontend ?? "", backend: parsed.backend ?? "" };
    }
  } catch {}
  return { frontend: raw, backend: "" };
};

const ProjectDetail = ({ productId, initialProject }: ProjectDetailProps) => {
  const locale = useLocale();
  const t = useTranslations("Works");
  const [project, setProject] = useState<ProjectRecord>(initialProject);
  const githubUrls = parseGithubUrls(project.githubUrl);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/projects/${productId}?locale=${locale}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!mounted) return;
        if (json?.data) setProject(json.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [productId, locale]);

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

            {/* Tech Detail Fields */}
            {(project.techStack || project.deployment || project.server || project.designMethod || project.orm || project.database || project.domainProvider) && (
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {project.techStack && <div><span className="text-gray-400">Tech Stack:</span> <span className="text-neutral-200">{project.techStack}</span></div>}
                {project.deployment && <div><span className="text-gray-400">Deployment:</span> <span className="text-neutral-200">{project.deployment}</span></div>}
                {project.server && <div><span className="text-gray-400">Server:</span> <span className="text-neutral-200">{project.server}</span></div>}
                {project.designMethod && <div><span className="text-gray-400">Desain/AI:</span> <span className="text-neutral-200">{project.designMethod}</span></div>}
                {project.orm && <div><span className="text-gray-400">ORM:</span> <span className="text-neutral-200">{project.orm}</span></div>}
                {project.database && <div><span className="text-gray-400">Database:</span> <span className="text-neutral-200">{project.database}</span></div>}
                {project.domainProvider && <div><span className="text-gray-400">Domain:</span> <span className="text-neutral-200">{project.domainProvider}</span></div>}
              </div>
            )}
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
                {githubUrls.frontend && (
                  <a href={githubUrls.frontend} target="_blank" rel="noopener noreferrer" className="flex gap-2 mt-6 text-white bg-black dark:bg-brand-700 border-0 py-2 px-8 focus:outline-none hover:bg-black/90 hover:text-white rounded text-lg">
                    <IconBrandGithub className="w-5 h-5 mt-1" />
                    Frontend
                  </a>
                )}
                {githubUrls.backend && (
                  <a href={githubUrls.backend} target="_blank" rel="noopener noreferrer" className="flex gap-2 mt-6 bg-gray-700 dark:bg-brand-600 border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 hover:text-white rounded text-lg">
                    <IconBrandGithub className="w-5 h-5 mt-1" />
                    Backend
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

export default ProjectDetail;
