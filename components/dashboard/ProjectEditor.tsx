"use client";

import { useMemo, useState, useTransition, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Globe2, ImageUp, Languages, PencilLine, PlusCircle } from "lucide-react";
import type { ProjectRecord } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ProjectEditorProps = {
  project?: ProjectRecord | null;
  isOpen: boolean;
  onSaved?: () => void;
};

const createInitialState = (project?: ProjectRecord | null) => ({
  productId: project?.productId?.toString() ?? "",
  image: project?.image ?? "",
  urlPreview: project?.urlPreview ?? "",
  githubUrl: project?.githubUrl ?? "",
  figmaUrl: project?.figmaUrl ?? "",
  technologies: project?.technologies.join(", ") ?? "",
  categories: project?.categories.join(", ") ?? "Frontend App",
  internal: project?.internal ?? false,
  translations: {
    id: {
      projectName: project?.translations.id?.projectName ?? "",
      description: project?.translations.id?.description ?? "",
    },
    en: {
      projectName: project?.translations.en?.projectName ?? "",
      description: project?.translations.en?.description ?? "",
    },
  },
});

export function ProjectEditor({
  project,
  isOpen,
  onSaved,
}: ProjectEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(() => createInitialState(project));

  // Update form when project prop changes (e.g. switching between edit items)
  useEffect(() => {
    setForm(createInitialState(project));
    setError(null);
    setSuccess(null);
  }, [project, isOpen]);

  useEffect(() => {
    const scrollArea = document.querySelector<HTMLElement>("[data-dashboard-scroll-area]");

    if (!scrollArea) {
      return;
    }

    const previousOverflow = scrollArea.style.overflowY;
    const previousOverscrollBehavior = scrollArea.style.overscrollBehavior;

    if (isOpen) {
      scrollArea.style.overflowY = "hidden";
      scrollArea.style.overscrollBehavior = "contain";
    } else {
      scrollArea.style.overflowY = previousOverflow;
      scrollArea.style.overscrollBehavior = previousOverscrollBehavior;
    }

    return () => {
      scrollArea.style.overflowY = previousOverflow;
      scrollArea.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [isOpen]);

  const mode = useMemo(() => (project ? "edit" : "create"), [project]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    params.delete("add");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const updateField = (key: keyof Omit<typeof form, "translations">, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateTranslation = (locale: "id" | "en", field: "projectName" | "description", value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: {
          ...current.translations[locale],
          [field]: value,
        },
      },
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setSuccess(null);

    startUploadTransition(async () => {
      const payload = new FormData();
      payload.append("file", file);

      const response = await fetch("/api/uploads/project-image", {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || "Gagal upload image.");
        event.target.value = "";
        return;
      }

      updateField("image", result?.data?.url ?? "");
      setSuccess("Image berhasil diupload ke storage.");
      event.target.value = "";
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const endpoint = mode === "edit" && project ? `/api/projects/${project.productId}` : "/api/projects";
      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message || "Gagal menyimpan project.");
        return;
      }

      setSuccess(mode === "edit" ? "Project berhasil diperbarui." : "Project berhasil ditambahkan ke database.");
      onSaved?.();

      if (mode === "create") {
        setForm(createInitialState());
      }

      router.refresh();
      // Optionally close on success after a delay
      setTimeout(handleClose, 1500);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        ref={dialogContentRef}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          dialogContentRef.current?.focus({ preventScroll: true });
        }}
        className="max-h-[90svh] max-w-4xl overflow-y-auto overscroll-contain border-white/10 bg-[#0a0a0a] text-white"
      >
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              {mode === "edit" ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
              {mode === "edit" ? "Edit Mode" : "Create Mode"}
            </Badge>
            <Badge variant="outline" className="gap-1 border-white/10">
              <Languages className="h-3.5 w-3.5" />
              ID + EN
            </Badge>
          </div>
          <DialogTitle className="mt-2 text-2xl font-semibold">
            {mode === "edit" ? "Perbarui project bilingual" : "Tambah project bilingual"}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Simpan konten dinamis project per locale. Nama dan deskripsi wajib diisi untuk kedua bahasa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="productId" className="text-white/80">Product ID</Label>
              <Input id="productId" value={form.productId} onChange={(e) => updateField("productId", e.target.value)} className="border-white/10 bg-white/5" placeholder="11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-white/80">Image URL</Label>
              <Input id="image" value={form.image} onChange={(e) => updateField("image", e.target.value)} className="border-white/10 bg-white/5" placeholder="https://minio-domain/bucket/projects/example.webp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories" className="text-white/80">Categories</Label>
              <Input id="categories" value={form.categories} onChange={(e) => updateField("categories", e.target.value)} className="border-white/10 bg-white/5" placeholder="Frontend, Fullstack" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technologies" className="text-white/80">Technologies</Label>
              <Input id="technologies" value={form.technologies} onChange={(e) => updateField("technologies", e.target.value)} className="border-white/10 bg-white/5" placeholder="Next.js, Tailwind" />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <ImageUp className="h-4 w-4 text-amber-300" />
                Upload image project ke MinIO
              </div>
              <p className="text-sm text-white/60">
                Pilih file JPG, PNG, WEBP, atau SVG. Setelah upload berhasil, URL akan otomatis masuk ke field image.
              </p>
              <Input
                id="projectImageUpload"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="border-white/10 bg-white/5 file:mr-4 file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
              />
              <p className="text-xs text-white/40">
                Maksimal 5MB. Jika perlu, Anda tetap bisa paste URL image manual di field atas.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <div className="flex h-full min-h-[180px] items-center justify-center">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt="Preview image project"
                    width={220}
                    height={180}
                    className="h-full min-h-[180px] w-full object-cover"
                  />
                ) : (
                  <div className="px-4 text-center text-sm text-white/45">
                    Preview image akan tampil di sini setelah URL diisi atau upload selesai.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="urlPreview" className="text-white/80">Preview URL</Label>
              <Input id="urlPreview" value={form.urlPreview} onChange={(e) => updateField("urlPreview", e.target.value)} className="border-white/10 bg-white/5" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-white/80">Github URL</Label>
              <Input id="githubUrl" value={form.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} className="border-white/10 bg-white/5" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="figmaUrl" className="text-white/80">Figma URL</Label>
              <Input id="figmaUrl" value={form.figmaUrl} onChange={(e) => updateField("figmaUrl", e.target.value)} className="border-white/10 bg-white/5" placeholder="https://figma.com/..." />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/10">
            <input type="checkbox" checked={form.internal} onChange={(e) => updateField("internal", e.target.checked)} className="h-4 w-4 rounded border-white/10" />
            Tandai sebagai internal project
          </label>

          <Separator className="bg-white/10" />

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Globe2 className="h-4 w-4 text-amber-300" />
                <h3 className="font-semibold">Bahasa Indonesia</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectNameId" className="text-white/70">Nama Project</Label>
                <Input id="projectNameId" value={form.translations.id.projectName} onChange={(e) => updateTranslation("id", "projectName", e.target.value)} className="border-white/10 bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionId" className="text-white/70">Deskripsi</Label>
                <Textarea id="descriptionId" value={form.translations.id.description} onChange={(e) => updateTranslation("id", "description", e.target.value)} className="border-white/10 bg-black/20 min-h-[100px]" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Globe2 className="h-4 w-4 text-sky-400" />
                <h3 className="font-semibold">English</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectNameEn" className="text-white/70">Project Name</Label>
                <Input id="projectNameEn" value={form.translations.en.projectName} onChange={(e) => updateTranslation("en", "projectName", e.target.value)} className="border-white/10 bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn" className="text-white/70">Description</Label>
                <Textarea id="descriptionEn" value={form.translations.en.description} onChange={(e) => updateTranslation("en", "description", e.target.value)} className="border-white/10 bg-black/20 min-h-[100px]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {error && <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
            {success && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</p>}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleClose} className="rounded-full border-white/10 bg-transparent text-white hover:bg-white/10">
                Batal
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-full bg-amber-300 px-8 text-black hover:bg-amber-200 font-semibold">
                {isPending ? "Menyimpan..." : mode === "edit" ? "Update Project" : "Simpan Project"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
