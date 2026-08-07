"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, LayoutDashboard, FileText } from "lucide-react";
import type { ProjectDashboardSummary, ProjectLocale, ProjectPaginationMeta, ProjectRecord } from "@/app/types/project";
import { ProjectEditor } from "@/components/dashboard/ProjectEditor";
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNeo, NEO } from "@/components/dashboard/neo";

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
  const { isNeo } = useNeo();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [summary, setSummary] = useState<ProjectDashboardSummary>(emptySummary);
  const [pagination, setPagination] = useState<ProjectPaginationMeta>(emptyPagination(searchParams.get("search") ?? ""));
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);

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

  // Saat edit, ambil detail project langsung dari API supaya data benar-benar realtime (bukan dari list yang bisa stale)
  useEffect(() => {
    if (!editProductId) {
      setEditingProject(null);
      return;
    }

    let mounted = true;
    // Fallback jika API gagal/tidak menemukan → pakai data list yang sudah ada
    const fallback = projects.find((project) => project.productId === editProductId) ?? null;

    fetch(`/api/projects/${editProductId}?locale=${locale}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!mounted) return;
        setEditingProject((json?.data as ProjectRecord) ?? fallback);
      })
      .catch(() => {
        if (!mounted) return;
        setEditingProject(fallback);
      });

    return () => {
      mounted = false;
    };
  }, [editProductId, locale]);

  const handleReorder = useCallback(async (items: { productId: string; sortOrder: number }[]) => {
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
      <div className={cn("relative overflow-hidden p-6", isNeo ? NEO.cardAmber : "rounded-2xl border border-black/10 bg-white")}>
        {!isNeo && <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />}
        <div className="flex items-start justify-between">
          <div>
            <h1 className={cn("text-xl font-bold", isNeo ? "text-black" : "text-black")}>Welcome back, Admin</h1>
            <p className={cn("mt-1 text-sm", isNeo ? "font-medium text-black" : "text-black")}>Kelola portfolio project CV kamu di sini. Tambah, edit, urutkan, atau hapus project dengan mudah.</p>
          </div>
          <Badge variant="outline" className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs", isNeo ? "border-2 border-black bg-white font-bold text-black shadow-[2px_2px_0px_0px_black]" : "border border-black/10 bg-white text-black")}>
            <KeyRound className="h-3 w-3" />
            {userEmail}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <ProjectStats totalProjects={summary.totalProjects} internalProjects={summary.internalProjects} publicProjects={summary.publicProjects} totalSkills={summary.totalSkills} totalCategories={summary.totalCategories} />

      {/* Error & Table */}
      {error && (
        <div className={cn("px-4 py-3 text-sm font-medium", isNeo ? "border-2 border-black bg-rose-100 text-rose-700 shadow-[3px_3px_0px_0px_black]" : "rounded-2xl border border-rose-500/30 bg-rose-100 text-rose-700")}>{error}</div>
      )}

      <ProjectTable locale={locale} projects={projects} pagination={pagination} isLoading={isLoading} onDeleted={refetchProjects} onReorder={handleReorder} isReordering={isReordering} />

      <ProjectEditor project={editingProject} isOpen={isAdding || editingProject !== null} onSaved={refetchProjects} />
    </main>
  );
}
