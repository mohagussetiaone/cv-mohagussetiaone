"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  ExternalLink,
  Eye,
  FilePenLine,
  GripVertical,
  PlusCircle,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type {
  ProjectPaginationMeta,
  ProjectRecord,
} from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteButton } from "./DeleteButton";
import { cn } from "@/lib/utils";
import { useNeo, NEO } from "@/components/dashboard/neo";
import { useDebounce } from "@/hooks/use-debounce";

type ProjectTableProps = {
  locale: string;
  projects: ProjectRecord[];
  pagination: ProjectPaginationMeta;
  isLoading?: boolean;
  onDeleted?: () => void;
  onReorder?: (items: { productId: string; sortOrder: number }[]) => void;
  isReordering?: boolean;
};

const createQueryString = (
  current: ProjectPaginationMeta,
  params: Partial<Pick<ProjectPaginationMeta, "page" | "pageSize" | "search">>
) => {
  const query = new URLSearchParams();
  const page = params.page ?? current.page;
  const pageSize = params.pageSize ?? current.pageSize;
  const search = params.search ?? current.search;
  query.set("page", String(page));
  query.set("pageSize", String(pageSize));
  if (search.trim()) {
    query.set("search", search.trim());
  }
  return query.toString();
};

function SortableRow({
  project,
  locale,
  pagination,
  onDeleted,
  isNeo,
}: {
  project: ProjectRecord;
  locale: string;
  pagination: ProjectPaginationMeta;
  onDeleted?: () => void;
  isNeo: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.productId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 border-b px-4 py-3 transition-colors last:border-b-0",
        isNeo ? "border-black/10 hover:bg-amber-100/50" : "border-black/5 hover:bg-black/5",
        isDragging ? (isNeo ? "bg-amber-200 shadow-[4px_4px_0px_0px_black]" : "rounded-xl bg-black/5 shadow-xl shadow-black/10") : "",
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn("flex cursor-grab touch-none items-center transition-colors active:cursor-grabbing", isNeo ? "text-black/30 hover:text-black" : "text-black/30 hover:text-black")}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Project Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("truncate text-sm font-medium", isNeo ? "text-black" : "text-black")}>{project.projectName}</p>
          {project.internal && (
            <Badge className={cn("shrink-0 px-1.5 py-0 text-[10px]", isNeo ? "border-2 border-black bg-amber-400 font-bold text-black" : "border-amber-500/20 bg-amber-500/10 text-amber-400")}>
              Internal
            </Badge>
          )}
        </div>
        <p className={cn("mt-0.5 line-clamp-1 text-xs", isNeo ? "text-black" : "text-black")}>{project.description}</p>
      </div>

      {/* Categories */}
      <div className="hidden w-36 shrink-0 xl:block">
        <div className="flex flex-wrap gap-1">
          {project.categories.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className={cn("px-1.5 py-0 text-[10px]", isNeo ? "border border-black bg-white font-bold text-black" : "border border-black/10 bg-white text-black")}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="hidden w-40 shrink-0 lg:block">
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge
              key={tech}
              className={cn("px-1.5 py-0 text-[10px]", isNeo ? "border-2 border-black bg-amber-200 font-bold text-black" : "bg-brand-500/15 text-brand-400 hover:bg-brand-500/20")}
            >
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <span className={cn("text-[10px]", isNeo ? "text-black" : "text-black")}>+{project.technologies.length - 3}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isNeo ? "text-black/40 hover:bg-black/10 hover:text-black" : "text-black/40 hover:bg-black/10 hover:text-black")}
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn("w-44", isNeo ? "border-[3px] border-black bg-white text-black shadow-[4px_4px_0px_0px_black]" : "border border-black/10 bg-white text-black")}>
            <DropdownMenuItem asChild className={cn(isNeo ? "text-black hover:bg-amber-100 focus:bg-amber-100" : "text-black hover:bg-black/5 focus:bg-black/5")}>
              <Link
                href={`/${locale}/project/${project.productId}`}
                className="inline-flex w-full items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={cn(isNeo ? "text-black hover:bg-amber-100 focus:bg-amber-100" : "text-black hover:bg-black/5 focus:bg-black/5")}>
              <Link
                href={`/${locale}/dashboard?edit=${project.productId}&page=${pagination.page}&pageSize=${pagination.pageSize}${pagination.search ? `&search=${encodeURIComponent(pagination.search)}` : ""}`}
                scroll={false}
                className="inline-flex w-full items-center gap-2"
              >
                <FilePenLine className="h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            {project.urlPreview ? (
              <DropdownMenuItem asChild className={cn(isNeo ? "text-black hover:bg-amber-100 focus:bg-amber-100" : "text-black hover:bg-black/5 focus:bg-black/5")}>
                <Link
                  href={project.urlPreview}
                  target="_blank"
                  className="inline-flex w-full items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator className="bg-black/10" />
            <DeleteButton
              productId={project.productId}
              projectName={project.projectName}
              onDeleted={onDeleted}
              trigger={
                <button className={cn("flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors", isNeo ? "font-bold text-rose-600 hover:bg-rose-100 focus:bg-rose-100" : "text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10")}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function ProjectTable({
  locale,
  projects,
  pagination,
  isLoading = false,
  onDeleted,
  onReorder,
  isReordering = false,
}: ProjectTableProps) {
  const { isNeo } = useNeo();
  const [localProjects, setLocalProjects] = useState(projects);

  // Sync localProjects when projects prop changes
  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const router = useRouter();
  const pathname = usePathname();

  // ── Pencarian realtime (search-as-you-type) dengan debounce ──
  const [searchInput, setSearchInput] = useState(pagination.search);
  const [searchFocused, setSearchFocused] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);
  const pageSizeRef = useRef(pagination.pageSize);
  pageSizeRef.current = pagination.pageSize;

  // Sinkronkan input saat URL berubah dari luar (mis. back/forward), tapi jangan
  // sambil user mengetik supaya input tidak terpotong.
  useEffect(() => {
    if (!searchFocused) {
      setSearchInput(pagination.search);
    }
  }, [pagination.search, searchFocused]);

  // Saat nilai debounce berubah → update URL → list di-refetch otomatis oleh client.
  // Jika nilai sudah sama dengan query URL (termasuk render pertama), tidak perlu replace.
  useEffect(() => {
    const currentSearch = new URLSearchParams(window.location.search).get("search") ?? "";
    const value = debouncedSearch.trim();
    if (value === currentSearch) return;

    const query = new URLSearchParams();
    query.set("page", "1");
    query.set("pageSize", String(pageSizeRef.current));
    if (value) {
      query.set("search", value);
    }
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  }, [debouncedSearch, pathname, router]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const projectIds = useMemo(
    () => localProjects.map((p) => p.productId),
    [localProjects]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      let reorderedItems: { productId: string; sortOrder: number }[] = [];

      setLocalProjects((prev) => {
        const oldIndex = prev.findIndex((p) => p.productId === active.id);
        const newIndex = prev.findIndex((p) => p.productId === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const updated = [...prev];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);

        reorderedItems = updated.map((p, i) => ({
          productId: p.productId,
          sortOrder: (i + 1) * 10,
        }));

        return updated.map((p, i) => ({
          ...p,
          sortOrder: (i + 1) * 10,
        }));
      });

      // Call onReorder outside state updater
      if (reorderedItems.length > 0) {
        onReorder?.(reorderedItems);
      }
    },
    [onReorder]
  );

  const previousQuery = createQueryString(pagination, {
    page: Math.max(1, pagination.page - 1),
  });
  const nextQuery = createQueryString(pagination, {
    page: Math.min(pagination.totalPages, pagination.page + 1),
  });

  return (
    <div id="projects" className={cn("overflow-hidden", isNeo ? NEO.card : "rounded-2xl border border-black/10 bg-white")}>
      {/* Header */}
      <div className={cn("border-b px-5 py-4", isNeo ? "border-black/15" : "border-black/10")}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", isNeo ? "text-amber-600" : "text-brand-400")}>
              Project Table
            </p>
            <h2 className={cn("mt-1 text-xl font-bold", isNeo ? "text-black" : "text-black")}>
              Portfolio entries
            </h2>
            <p className={cn("mt-0.5 text-sm", isNeo ? "text-black" : "text-black")}>
              Drag rows to reorder. Click <strong className="text-black">Add</strong> to create a new entry.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className={cn("pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", isNeo ? "text-black/40" : "text-black/40")} />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Cari project..."
                  className={cn(
                    "flex h-10 w-full min-w-[220px] rounded-xl py-2 pl-10 pr-3 text-sm outline-none ring-offset-background",
                    isNeo
                      ? "border-2 border-black bg-white font-medium text-black shadow-[2px_2px_0px_0px_black] placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-amber-400"
                      : "border border-black/10 bg-white font-medium text-black placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-amber-400",
                  )}
                />
              </div>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  aria-label="Hapus pencarian"
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                    isNeo ? "border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_black] hover:bg-amber-100" : "border border-black/10 bg-white text-black hover:bg-black/5",
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Link href={`/${locale}/dashboard?add=true`} scroll={false}>
              <Button className={cn("rounded-xl font-bold", isNeo ? NEO.btn : "bg-brand-500 text-black hover:bg-brand-400 font-medium")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Reorder indicator */}
        {isReordering && (
          <div className={cn("mt-3 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold", isNeo ? "border-2 border-black bg-amber-200 text-black shadow-[2px_2px_0px_0px_black]" : "border border-amber-400/40 bg-amber-100 text-black")}>
            <Save className="h-4 w-4 animate-pulse" />
            Saving new order...
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className={cn("hidden border-b px-4 py-2 text-xs font-bold uppercase tracking-wider md:flex md:items-center md:gap-3", isNeo ? "border-black/10 text-black" : "border-black/5 text-black")}>
        <div className="w-8 shrink-0" />
        <div className="min-w-0 flex-1">Project</div>
        <div className="hidden w-36 shrink-0 xl:block">Category</div>
        <div className="hidden w-40 shrink-0 lg:block">Stack</div>
        <div className="w-12 shrink-0" />
      </div>

      {/* Rows */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className={cn("h-8 w-8 animate-spin rounded-full border-2", isNeo ? "border-black/20 border-t-black" : "border-brand-500/30 border-t-brand-500")} />
            <p className={cn("text-sm", isNeo ? "text-black" : "text-black")}>Memuat data project...</p>
          </div>
        </div>
      ) : localProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FolderOpenIcon className={isNeo ? "text-black/20" : "text-black/20"} />
          <p className={cn("mt-4 text-sm", isNeo ? "text-black" : "text-black")}>Belum ada data yang cocok dengan filter ini.</p>
          <Link href={`/${locale}/dashboard`}>
            <Button variant="outline" className={cn("mt-4", isNeo ? NEO.btnOutline : "border border-black/10 bg-white text-black hover:bg-black/5")}>
              Reset Filter
            </Button>
          </Link>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={projectIds}
            strategy={verticalListSortingStrategy}
          >
            <div className={isNeo ? "" : "divide-y divide-white/5"}>
              {localProjects.map((project) => (
                <SortableRow
                  key={project.productId}
                  project={project}
                  locale={locale}
                  pagination={pagination}
                  onDeleted={onDeleted}
                  isNeo={isNeo}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Pagination */}
      <div className={cn("flex flex-col gap-4 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between", isNeo ? "border-black/15" : "border-black/10")}>
        <div className={cn("text-sm", isNeo ? "text-black" : "text-black")}>
          Menampilkan{" "}
          <span className={cn("font-bold", isNeo ? "text-black" : "text-black")}>
            {localProjects.length}
          </span>{" "}
          dari{" "}
          <span className={cn("font-bold", isNeo ? "text-black" : "text-black")}>
            {pagination.totalItems}
          </span>{" "}
          project.
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/dashboard?${previousQuery}`}
            aria-disabled={pagination.page <= 1}
            className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              variant="outline"
              className={cn(isNeo ? NEO.btnOutline : "border border-black/10 bg-white text-black hover:bg-black/5")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          </Link>

          <div className={cn("rounded-xl border px-4 py-2 text-sm font-bold", isNeo ? "border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_black]" : "border border-black/10 bg-white text-black")}>
            Page {pagination.page} of {pagination.totalPages}
          </div>

          <Link
            href={`/${locale}/dashboard?${nextQuery}`}
            aria-disabled={pagination.page >= pagination.totalPages}
            className={
              pagination.page >= pagination.totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }
          >
            <Button
              variant="outline"
              className={cn(isNeo ? NEO.btnOutline : "border border-black/10 bg-white text-black hover:bg-black/5")}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FolderOpenIcon({ className = "h-12 w-12 text-black/20" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
}
