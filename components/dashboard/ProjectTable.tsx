"use client";

import Link from "next/link";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  ExternalLink,
  Eye,
  FilePenLine,
  PlusCircle,
  Trash2,
} from "lucide-react";
import type {
  ProjectPaginationMeta,
  ProjectRecord,
} from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "./DeleteButton";

type ProjectTableProps = {
  locale: string;
  projects: ProjectRecord[];
  pagination: ProjectPaginationMeta;
  isLoading?: boolean;
  onDeleted?: () => void;
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

export function ProjectTable({
  locale,
  projects,
  pagination,
  isLoading = false,
  onDeleted,
}: ProjectTableProps) {
  const columns: ColumnDef<ProjectRecord>[] = [
    {
      accessorKey: "productId",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium text-slate-600">
          #{row.original.productId}
        </span>
      ),
    },
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => (
        <div className="min-w-[240px] space-y-1">
          <p className="font-medium text-slate-900">{row.original.projectName}</p>
          <p className="line-clamp-2 text-xs text-slate-500">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      id: "categories",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex max-w-[220px] flex-wrap gap-2">
          {row.original.categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="border-slate-200 bg-white text-slate-600"
            >
              {category}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "stack",
      header: "Stack",
      cell: ({ row }) => (
        <div className="flex max-w-[240px] flex-wrap gap-2">
          {row.original.technologies.slice(0, 4).map((tech) => (
            <Badge
              key={tech}
              className="bg-slate-900 text-white hover:bg-slate-900"
            >
              {tech}
            </Badge>
          ))}
          {row.original.technologies.length > 4 ? (
            <Badge variant="secondary">
              +{row.original.technologies.length - 4}
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.internal
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-emerald-200 bg-emerald-50 text-emerald-600"
          }
        >
          {row.original.internal ? "Internal" : "Public"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">Open actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/project/${row.original.productId}`}
                className="inline-flex w-full items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/dashboard?edit=${row.original.productId}&page=${pagination.page}&pageSize=${pagination.pageSize}${pagination.search ? `&search=${encodeURIComponent(pagination.search)}` : ""}`}
                scroll={false}
                className="inline-flex w-full items-center gap-2"
              >
                <FilePenLine className="h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            {row.original.urlPreview ? (
              <DropdownMenuItem asChild>
                <Link
                  href={row.original.urlPreview}
                  target="_blank"
                  className="inline-flex w-full items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DeleteButton
              productId={row.original.productId}
              projectName={row.original.projectName}
              onDeleted={onDeleted}
              trigger={
                <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-rose-600 outline-none transition-colors hover:bg-rose-50 focus:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  const previousQuery = createQueryString(pagination, {
    page: Math.max(1, pagination.page - 1),
  });
  const nextQuery = createQueryString(pagination, {
    page: Math.min(pagination.totalPages, pagination.page + 1),
  });

  return (
    <Card
      id="projects"
      className="overflow-hidden border-slate-200 bg-white shadow-sm"
    >
      <CardHeader className="border-b border-slate-100 bg-slate-50/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Project Table
            </p>
            <CardTitle className="mt-1 text-2xl text-slate-900">
              Portfolio entries
            </CardTitle>
            <CardDescription className="mt-1 text-slate-500">
              TanStack Table dengan pagination server-side dari App Router.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form action={`/${locale}/dashboard`} className="flex gap-2">
              <input type="hidden" name="page" value="1" />
              <input type="hidden" name="pageSize" value={pagination.pageSize} />
              <input
                type="search"
                name="search"
                defaultValue={pagination.search}
                placeholder="Cari project, stack, kategori..."
                className="flex h-10 w-full min-w-[240px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-background placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-950"
              />
              <Button type="submit" variant="outline" className="border-slate-200">
                Cari
              </Button>
            </form>

            <Link href={`/${locale}/dashboard?add=true`} scroll={false}>
              <Button className="bg-slate-950 text-white hover:bg-slate-800">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap text-slate-500">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-slate-100 hover:bg-slate-50/60">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-slate-500"
                >
                  {isLoading
                    ? "Memuat data project..."
                    : "Belum ada data yang cocok dengan filter ini."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-medium text-slate-900">
              {projects.length}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-900">
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
              <Button variant="outline" className="border-slate-200">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            </Link>

            <div className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
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
              <Button variant="outline" className="border-slate-200">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
