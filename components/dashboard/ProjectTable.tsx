"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

type ProjectTableProps = {
  locale: string;
  projects: ProjectRecord[];
  pagination: ProjectPaginationMeta;
  isLoading?: boolean;
  onDeleted?: () => void;
  onReorder?: (items: { productId: number; sortOrder: number }[]) => void;
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
}: {
  project: ProjectRecord;
  locale: string;
  pagination: ProjectPaginationMeta;
  onDeleted?: () => void;
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
      className={`group flex items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-b-0 hover:bg-white/[0.02] ${isDragging ? "rounded-xl bg-white/10 shadow-xl shadow-black/30" : ""}`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex cursor-grab touch-none items-center text-white/20 transition-colors hover:text-white/50 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* ID */}
      <div className="w-14 shrink-0">
        <span className="text-xs font-mono text-white/40">#{project.productId}</span>
      </div>

      {/* Project Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-white">{project.projectName}</p>
          {project.internal && (
            <Badge className="shrink-0 border-amber-500/20 bg-amber-500/10 px-1.5 py-0 text-[10px] text-amber-400">
              Internal
            </Badge>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-white/40">{project.description}</p>
      </div>

      {/* Categories */}
      <div className="hidden w-36 shrink-0 xl:block">
        <div className="flex flex-wrap gap-1">
          {project.categories.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className="border-white/10 bg-white/5 px-1.5 py-0 text-[10px] text-white/50"
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
              className="bg-brand-500/15 text-brand-400 hover:bg-brand-500/20 px-1.5 py-0 text-[10px]"
            >
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[10px] text-white/30">+{project.technologies.length - 3}</span>
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
              className="h-8 w-8 text-white/40 hover:bg-white/10 hover:text-white"
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 border-white/10 bg-[#12121a] text-white">
            <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/5">
              <Link
                href={`/${locale}/project/${project.productId}`}
                className="inline-flex w-full items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/5">
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
              <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/5">
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
            <DropdownMenuSeparator className="bg-white/10" />
            <DeleteButton
              productId={project.productId}
              projectName={project.projectName}
              onDeleted={onDeleted}
              trigger={
                <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-rose-400 outline-none transition-colors hover:bg-rose-500/10 focus:bg-rose-500/10">
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
  const [localProjects, setLocalProjects] = useState(projects);

  // Sync localProjects when projects prop changes
  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

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

      let reorderedItems: { productId: number; sortOrder: number }[] = [];

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
    <div id="projects" className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Project Table
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              Portfolio entries
            </h2>
            <p className="mt-0.5 text-sm text-white/40">
              Drag rows to reorder. Click <strong className="text-white/60">Add</strong> to create a new entry.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form action={`/${locale}/dashboard`} className="flex gap-2">
              <input type="hidden" name="page" value="1" />
              <input type="hidden" name="pageSize" value={pagination.pageSize} />
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="search"
                  name="search"
                  defaultValue={pagination.search}
                  placeholder="Cari project..."
                  className="flex h-10 w-full min-w-[220px] rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white outline-none ring-offset-background placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-brand-500/50"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                Cari
              </Button>
              {pagination.search && (
                <Link
                  href={`/${locale}/dashboard`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
            </form>

            <Link href={`/${locale}/dashboard?add=true`} scroll={false}>
              <Button className="rounded-xl bg-brand-500 text-black hover:bg-brand-400 font-medium">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Reorder indicator */}
        {isReordering && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/5 px-4 py-2 text-sm text-brand-400">
            <Save className="h-4 w-4 animate-pulse" />
            Saving new order...
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="hidden border-b border-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/30 md:flex md:items-center md:gap-3">
        <div className="w-8 shrink-0" />
        <div className="w-14 shrink-0">ID</div>
        <div className="min-w-0 flex-1">Project</div>
        <div className="hidden w-36 shrink-0 xl:block">Category</div>
        <div className="hidden w-40 shrink-0 lg:block">Stack</div>
        <div className="w-12 shrink-0" />
      </div>

      {/* Rows */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
            <p className="text-sm text-white/40">Memuat data project...</p>
          </div>
        </div>
      ) : localProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FolderOpenIcon />
          <p className="mt-4 text-sm text-white/40">Belum ada data yang cocok dengan filter ini.</p>
          <Link href={`/${locale}/dashboard`}>
            <Button variant="outline" className="mt-4 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">
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
            <div className="divide-y divide-white/5">
              {localProjects.map((project) => (
                <SortableRow
                  key={project.productId}
                  project={project}
                  locale={locale}
                  pagination={pagination}
                  onDeleted={onDeleted}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Pagination */}
      <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/40">
          Menampilkan{" "}
          <span className="font-medium text-white">
            {localProjects.length}
          </span>{" "}
          dari{" "}
          <span className="font-medium text-white">
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
              className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          </Link>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
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
              className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
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

function FolderOpenIcon() {
  return (
    <svg
      className="h-12 w-12 text-white/20"
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
