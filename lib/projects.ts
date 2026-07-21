import { prisma } from "@/lib/prisma";
import type { ProjectDashboardSummary, ProjectLocale, ProjectPaginationMeta, ProjectRecord, ProjectTranslationRecord } from "@/app/types/project";

const projectInclude = {
  skills: {
    orderBy: {
      name: "asc" as const,
    },
  },
  categories: {
    orderBy: {
      name: "asc" as const,
    },
  },
  translations: true,
};

const mapProject = (
  project: {
    id: number;
    productId: number;
    sortOrder: number;
    image: string | null;
    urlPreview: string | null;
    githubUrl: string | null;
    figmaUrl: string | null;
    internal: boolean;
    skills: { name: string }[];
    categories: { name: string }[];
    translations: {
      locale: string;
      projectName: string;
      description: string;
    }[];
  },
  locale: ProjectLocale,
): ProjectRecord => {
  const translationMap = project.translations.reduce<Record<ProjectLocale, ProjectTranslationRecord | null>>(
    (accumulator, translation) => {
      if (translation.locale === "id" || translation.locale === "en") {
        accumulator[translation.locale] = {
          locale: translation.locale,
          projectName: translation.projectName,
          description: translation.description,
        };
      }

      return accumulator;
    },
    {
      id: null,
      en: null,
    },
  );

  const activeTranslation = translationMap[locale] ?? translationMap.id ?? translationMap.en;

  return {
    id: project.id,
    productId: project.productId,
    sortOrder: project.sortOrder,
    projectName: activeTranslation?.projectName ?? "",
    description: activeTranslation?.description ?? "",
    image: project.image,
    urlPreview: project.urlPreview,
    githubUrl: project.githubUrl,
    figmaUrl: project.figmaUrl,
    internal: project.internal,
    technologies: project.skills.map((skill) => skill.name),
    categories: project.categories.map((category) => category.name),
    translations: translationMap,
  };
};

export async function getProjects(locale: ProjectLocale) {
  const projects = await prisma.project.findMany({
    include: projectInclude,
    orderBy: [
      { sortOrder: "asc" },
      { productId: "asc" },
    ],
  });

  return projects.map((project) => mapProject(project, locale));
}

type ProjectPageOptions = {
  locale: ProjectLocale;
  page?: number;
  pageSize?: number;
  search?: string;
};

const buildProjectSearchWhere = (search?: string) => {
  const value = search?.trim();

  if (!value) {
    return {};
  }

  return {
    OR: [
      {
        translations: {
          some: {
            projectName: {
              contains: value,
              mode: "insensitive" as const,
            },
          },
        },
      },
      {
        translations: {
          some: {
            description: {
              contains: value,
              mode: "insensitive" as const,
            },
          },
        },
      },
      {
        skills: {
          some: {
            name: {
              contains: value,
              mode: "insensitive" as const,
            },
          },
        },
      },
      {
        categories: {
          some: {
            name: {
              contains: value,
              mode: "insensitive" as const,
            },
          },
        },
      },
    ],
  };
};

export async function getProjectsPage({ locale, page = 1, pageSize = 10, search = "" }: ProjectPageOptions): Promise<{
  data: ProjectRecord[];
  pagination: ProjectPaginationMeta;
  summary: ProjectDashboardSummary;
}> {
  const safePage = Number.isFinite(page) ? Math.max(1, page) : 1;
  const safePageSize = Number.isFinite(pageSize) ? Math.min(Math.max(5, pageSize), 50) : 10;
  const where = buildProjectSearchWhere(search);

  const [projects, totalItems, totalProjects, internalProjects, totalSkills, totalCategories] = await Promise.all([
    prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: [
        { sortOrder: "asc" },
        { productId: "asc" },
      ],
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    prisma.project.count({ where }),
    prisma.project.count(),
    prisma.project.count({
      where: {
        internal: true,
      },
    }),
    prisma.skill.count(),
    prisma.category.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

  return {
    data: projects.map((project) => mapProject(project, locale)),
    pagination: {
      page: Math.min(safePage, totalPages),
      pageSize: safePageSize,
      totalItems,
      totalPages,
      search: search.trim(),
    },
    summary: {
      totalProjects,
      internalProjects,
      publicProjects: Math.max(0, totalProjects - internalProjects),
      totalSkills,
      totalCategories,
    },
  };
}

export async function getProjectByProductId(productId: number, locale: ProjectLocale) {
  const project = await prisma.project.findUnique({
    where: { productId },
    include: projectInclude,
  });

  return project ? mapProject(project, locale) : null;
}
