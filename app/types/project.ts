export type ProjectLocale = "id" | "en";

export interface ProjectTranslationRecord {
  locale: ProjectLocale;
  projectName: string;
  description: string;
}

export interface ProjectRecord {
  id: number;
  productId: number;
  sortOrder: number;
  projectName: string;
  description: string;
  image: string | null;
  urlPreview: string | null;
  githubUrl: string | null;
  figmaUrl: string | null;
  internal: boolean;
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
