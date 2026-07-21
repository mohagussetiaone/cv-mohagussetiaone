"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, LayoutDashboard } from "lucide-react";
import type { ProjectDashboardSummary, ProjectLocale, ProjectPaginationMeta, ProjectRecord } from "@/app/types/project";
import { ProjectEditor } from "@/components/dashboard/ProjectEditor";
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { Badge } from "@/components/ui/badge";

type DashboardClientProps = {
  locale: string;
  userEmail: string;
};

type DashboardApiResponse = {
  data: ProjectRecord[];
  pagination: ProjectPaginationMeta;
  summary: ProjectDashboardSummary;
};

const emptySummary: ProjectDashboardSummary = {
  totalProjects: 0,
  internalProjects: 0,
  publicProjects: 0,
  totalSkills: 0,
  totalCategories: 0,
};

const emptyPagination = (search: string): ProjectPaginationMeta => ({
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
  search,
});

export function DashboardClient({ locale, userEmail }: DashboardClientProps) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [summary, setSummary] = useState<ProjectDashboardSummary>(emptySummary);
  const [pagination, setPagination] = useState<ProjectPaginationMeta>(emptyPagination(searchParams.get("search") ?? ""));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "10", 10);
  const search = searchParams.get("search") ?? "";
  const isAdding = searchParams.get("add") === "true";
  const editProductId = searchParams.get("edit");

  const refetchProjects = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setIsLoading(true);
        setError(null);

        const query = new URLSearchParams({
          locale: locale as ProjectLocale,
          page: String(Number.isNaN(page) ? 1 : page),
          pageSize: String(Number.isNaN(pageSize) ? 10 : pageSize),
        });

        if (search.trim()) {
          query.set("search", search.trim());
        }

        const response = await fetch(`/api/projects?${query.toString()}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const payload = (await response.json()) as DashboardApiResponse;

        if (!response.ok) {
          throw new Error("Gagal mengambil data dashboard dari API.");
        }

        if (!isMounted) {
          return;
        }

        setProjects(payload.data);
        setSummary(payload.summary);
        setPagination(payload.pagination);
      } catch (fetchError) {
        if (controller.signal.aborted || !isMounted) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Gagal mengambil data dashboard dari API.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [locale, page, pageSize, search, refreshKey]);

  const editingProject = useMemo(() => {
    const productId = Number.parseInt(editProductId ?? "", 10);

    if (!editProductId || Number.isNaN(productId)) {
      return null;
    }

    return projects.find((project) => project.productId === productId) ?? null;
  }, [editProductId, projects]);

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div className="px-4 lg:px-6">
        <ProjectStats totalProjects={summary.totalProjects} internalProjects={summary.internalProjects} publicProjects={summary.publicProjects} totalSkills={summary.totalSkills} totalCategories={summary.totalCategories} />
      </div>

      <div className="px-4 lg:px-6">
        {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        <ProjectTable locale={locale} projects={projects} pagination={pagination} isLoading={isLoading} onDeleted={refetchProjects} />
      </div>

      <ProjectEditor project={editingProject} isOpen={isAdding || editingProject !== null} onSaved={refetchProjects} />
    </main>
  );
}
