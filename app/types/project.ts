export type ProjectLocale = "id" | "en";

export interface ProjectTranslationRecord {
  locale: ProjectLocale;
  description: string;
}

export interface ProjectRecord {
  id: string;
  productId: string;
  sortOrder: number;
  projectName: string;
  description: string;
  image: string | null;
  urlPreview: string | null;
  githubUrl: string | null;
  figmaUrl: string | null;
  internal: boolean;
  // Tech detail fields
  techStack: string | null;
  deployment: string | null;
  server: string | null;
  designMethod: string | null;
  orm: string | null;
  database: string | null;
  domainProvider: string | null;
  technologies: string[];
  categories: string[];
  translations: Record<ProjectLocale, ProjectTranslationRecord | null>;
}

export interface ProjectDashboardSummary {
  totalProjects: number;
  internalProjects: number;
  publicProjects: number;
  totalSkills: number;
  totalCategories: number;
}

export interface ProjectPaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  search: string;
}
