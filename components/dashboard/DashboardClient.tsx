"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, LayoutDashboard, FileText } from "lucide-react";
import type { ProjectDashboardSummary, ProjectLocale, ProjectPaginationMeta, ProjectRecord } from "@/app/types/project";
import { ProjectEditor } from "@/components/dashboard/ProjectEditor";
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { SiteContentManager } from "@/components/dashboard/SiteContentManager";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  const [isReordering, setIsReordering] = useState(false);
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

  const handleReorder = useCallback(async (items: { productId: number; sortOrder: number }[]) => {
    setIsReordering(true);
    try {
      const response = await fetch("/api/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const payload = await response.json();
        toast.error(payload.message || "Gagal menyimpan urutan.");
        return;
      }

      toast.success("Urutan project berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan urutan project.");
    } finally {
      setIsReordering(false);
    }
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Welcome back, Admin</h1>
            <p className="mt-1 text-sm text-white/40">Kelola portfolio project CV kamu di sini. Tambah, edit, urutkan, atau hapus project dengan mudah.</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1.5 border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
            <KeyRound className="h-3 w-3" />
            {userEmail}
          </Badge>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <a href="#overview" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors">
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </a>
        <a href="#projects" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors">
          <FileText className="h-4 w-4" />
          Projects
        </a>
        <a href="#content-editor" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors">
          <LayoutDashboard className="h-4 w-4" />
          Content
        </a>
      </div>

      {/* Stats */}
      <ProjectStats totalProjects={summary.totalProjects} internalProjects={summary.internalProjects} publicProjects={summary.publicProjects} totalSkills={summary.totalSkills} totalCategories={summary.totalCategories} />

      {/* Error & Table */}
      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

      <ProjectTable locale={locale} projects={projects} pagination={pagination} isLoading={isLoading} onDeleted={refetchProjects} onReorder={handleReorder} isReordering={isReordering} />

      <ProjectEditor project={editingProject} isOpen={isAdding || editingProject !== null} onSaved={refetchProjects} />

      {/* Site Content Editor */}
      <SiteContentManager locale={locale} />
    </main>
  );
}
