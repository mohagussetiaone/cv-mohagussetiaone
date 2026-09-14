"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import type { ProjectLocale, ProjectPaginationMeta, ProjectRecord } from "@/app/types/project";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type ProjectClientProps = {
  locale: string;
  userEmail: string;
};

type ProjectApiResponse = {
  data: ProjectRecord[];
  pagination: ProjectPaginationMeta;
};

const emptyPagination = (search: string): ProjectPaginationMeta => ({
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
  search,
});

export function ProjectClient({ locale, userEmail }: ProjectClientProps) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [pagination, setPagination] = useState<ProjectPaginationMeta>(emptyPagination(searchParams.get("search") ?? ""));
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "10", 10);
  const search = searchParams.get("search") ?? "";

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

        const payload = (await response.json()) as ProjectApiResponse;

        if (!response.ok) throw new Error("Gagal mengambil data project.");

        if (!isMounted) return;

        setProjects(payload.data);
        setPagination(payload.pagination);
      } catch (fetchError) {
        if (controller.signal.aborted || !isMounted) return;
        setError(fetchError instanceof Error ? fetchError.message : "Gagal mengambil data project.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [locale, page, pageSize, search, refreshKey]);

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
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e] p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/dashboard`}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black dark:text-white/70 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
            </div>
            <h1 className="mt-3 text-xl font-semibold text-black dark:text-white">Project Management</h1>
            <p className="mt-1 text-sm text-black dark:text-white/60">
              Tambah, edit, urutkan, atau hapus project portfolio dengan mudah.
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1.5 border border-black/10 dark:border-white/10 bg-white dark:bg-[#121826] px-3 py-1.5 text-xs text-black dark:text-white">
            <KeyRound className="h-3 w-3" />
            {userEmail}
          </Badge>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-100 dark:bg-rose-900/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
          {error}
        </div>
      )}

      {/* Project Table */}
      <ProjectTable
        locale={locale}
        projects={projects}
        pagination={pagination}
        isLoading={isLoading}
        onDeleted={refetchProjects}
        onReorder={handleReorder}
        isReordering={isReordering}
      />


    </main>
  );
}
