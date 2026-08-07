"use client";

import { useMemo, useState, useTransition, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check, Globe2, ImageUp, Languages, PencilLine, PlusCircle, X } from "lucide-react";
import type { ProjectRecord } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { deleteImageByUrl } from "@/lib/upload-client";
import { projectPayloadSchema } from "@/lib/validators/project";
import { cn } from "@/lib/utils";

type ProjectEditorProps = {
  project?: ProjectRecord | null;
  isOpen: boolean;
  onSaved?: () => void;
};

type OptionsData = {
  skills: string[];
  categories: string[];
};

const createInitialState = (project?: ProjectRecord | null) => ({
  image: project?.image ?? "",
  urlPreview: project?.urlPreview ?? "",
  githubUrl: project?.githubUrl ?? "",
  figmaUrl: project?.figmaUrl ?? "",
  technologies: project?.technologies ?? [],
  categories: project?.categories ?? [],
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

export function ProjectEditor({ project, isOpen, onSaved }: ProjectEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(() => createInitialState(project));
  const [options, setOptions] = useState<OptionsData>({ skills: [], categories: [] });
  const [techInput, setTechInput] = useState("");
  const [techOpen, setTechOpen] = useState(false);

  // Fetch options from DB
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/dashboard/options")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch options");
        return res.json();
      })
      .then((data) => {
        if (data?.skills) setOptions(data);
      })
      .catch((err) => console.error("Failed to load editor options:", err));
  }, [isOpen]);

  // Update form when project prop changes
  useEffect(() => {
    setForm(createInitialState(project));
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  }, [project, isOpen]);

  useEffect(() => {
    const scrollArea = document.querySelector<HTMLElement>("[data-dashboard-scroll-area]");
    if (!scrollArea) return;

    const prevOverflow = scrollArea.style.overflowY;
    const prevBehavior = scrollArea.style.overscrollBehavior;

    if (isOpen) {
      scrollArea.style.overflowY = "hidden";
      scrollArea.style.overscrollBehavior = "contain";
    }

    return () => {
      scrollArea.style.overflowY = prevOverflow;
      scrollArea.style.overscrollBehavior = prevBehavior;
    };
  }, [isOpen]);

  const mode = useMemo(() => (project ? "edit" : "create"), [project]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    params.delete("add");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  const updateField = (key: keyof Omit<typeof form, "translations">, value: string | boolean | string[]) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateTranslation = (locale: "id" | "en", field: "projectName" | "description", value: string) => {
    const key = `translations.${locale}.${field}`;
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], [field]: value },
      },
    }));
  };

  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  const handleImageFileSelect = (file: File | null) => {
    // Revoke old preview
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    if (file) {
      setPreviewBlobUrl(URL.createObjectURL(file));
    }
    setPendingImageFile(file);
  };

  // Helper: upload pending image ke MinIO.
  // File lama TIDAK dihapus di sini — hanya dihapus setelah submit data sukses.
  const uploadPendingImage = async (): Promise<string> => {
    if (!pendingImageFile) return "";

    const payload = new FormData();
    payload.append("file", pendingImageFile);
    payload.append("folder", "projects");

    const response = await fetch("/api/uploads/general", { method: "POST", body: payload });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || "Gagal upload.");

    const newUrl = result?.data?.url ?? "";
    if (!newUrl) throw new Error("URL hasil upload kosong.");

    setPendingImageFile(null);
    return newUrl;
  };

  // Filter out already selected technologies for the dropdown
  const availableTechs = useMemo(() => options.skills.filter((s) => !form.technologies.includes(s)), [options.skills, form.technologies]);

  const techSearchResults = useMemo(() => availableTechs.filter((s) => s.toLowerCase().includes(techInput.toLowerCase())), [availableTechs, techInput]);

  const handleAddTech = useCallback(
    (tech: string) => {
      if (!form.technologies.includes(tech)) {
        setForm((prev) => ({
          ...prev,
          technologies: [...prev.technologies, tech],
        }));
      }
      setTechInput("");
    },
    [form.technologies],
  );

  const handleRemoveTech = useCallback((tech: string) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && techInput.trim()) {
        e.preventDefault();
        handleAddTech(techInput.trim());
      }
    },
    [techInput, handleAddTech],
  );

  // Validasi form dengan schema Zod yang SAMA dengan backend.
  // Kembalikan pesan error per-field; jika valid, kembalikan null.
  const validateForm = (): Record<string, string> | null => {
    const result = projectPayloadSchema.safeParse({
      image: form.image,
      urlPreview: form.urlPreview,
      githubUrl: form.githubUrl,
      figmaUrl: form.figmaUrl,
      internal: form.internal,
      categories: form.categories.join(", "),
      technologies: form.technologies.join(", "),
      translations: form.translations,
    });

    if (result.success) return null;

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      if (!errors[key]) errors[key] = issue.message;
    }
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Validasi dulu sebelum upload/submit — sama persis dengan aturan backend
    const validationErrors = validateForm();
    if (validationErrors) {
      setFieldErrors(validationErrors);
      setError("Periksa kembali isian form: " + Object.values(validationErrors)[0]);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      // URL image baru yang terlanjur diupload — dipakai untuk rollback jika submit gagal
      let uploadedNewUrl: string | null = null;

      try {
        // 1. Upload pending image dulu (jika ada)
        const newImage = pendingImageFile ? await uploadPendingImage() : form.image;
        if (newImage && newImage !== form.image) {
          uploadedNewUrl = newImage;
        }

        const endpoint = mode === "edit" && project ? `/api/projects/${project.productId}` : "/api/projects";
        const method = mode === "edit" ? "PATCH" : "POST";

        const body = {
          image: newImage,
          urlPreview: form.urlPreview,
          githubUrl: form.githubUrl,
          figmaUrl: form.figmaUrl,
          internal: form.internal,
          categories: form.categories.join(", "),
          technologies: form.technologies.join(", "),
          translations: form.translations,
        };

        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          // 2a. ROLLBACK: hapus image baru yang sudah diupload (data tidak jadi disimpan)
          if (uploadedNewUrl) {
            await deleteImageByUrl(uploadedNewUrl);
          }
          setError(payload?.message || "Gagal menyimpan project.");
          return;
        }

        // 2b. Submit sukses: hapus file lama yang diganti dengan yang baru
        if (uploadedNewUrl && form.image && form.image !== uploadedNewUrl) {
          await deleteImageByUrl(form.image);
        }

        // Update form.image with new URL after successful save
        if (newImage !== form.image) {
          updateField("image", newImage);
        }

        setSuccess(mode === "edit" ? "Project berhasil diperbarui." : "Project berhasil ditambahkan.");
        onSaved?.();

        if (mode === "create") {
          setForm(createInitialState());
        }

        router.refresh();
        setTimeout(handleClose, 1500);
      } catch (err) {
        // 3. ROLLBACK jika ada error tak terduga
        if (uploadedNewUrl) {
          await deleteImageByUrl(uploadedNewUrl);
        }
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90svh] max-w-4xl overflow-y-auto overscroll-contain border border-black/10 bg-white text-black">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              {mode === "edit" ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
              {mode === "edit" ? "Edit Mode" : "Create Mode"}
            </Badge>
            <Badge variant="outline" className="gap-1 border border-black/10">
              <Languages className="h-3.5 w-3.5" />
              ID + EN
            </Badge>
          </div>
          <DialogTitle className="mt-2 text-2xl font-semibold">{mode === "edit" ? "Perbarui project bilingual" : "Tambah project bilingual"}</DialogTitle>
          <DialogDescription className="text-black">{mode === "edit" ? `Edit project #${project?.productId.slice(0, 8) ?? ""}` : "Simpan konten dinamis project per locale."}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Categories (Select) + Technologies (Creatable Multi-Select) */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Categories */}
            <div className="space-y-2">
              <Label htmlFor="categories" className="text-black">
                Categories
              </Label>
              <Select value={form.categories[0] ?? ""} onValueChange={(val) => updateField("categories", [val])}>
                <SelectTrigger className="border border-black/10 bg-white text-black">
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent className="z-60 border border-black/10 bg-white text-black">
                  {options.categories.length === 0 && (
                    <SelectItem value="__loading" disabled>
                      Memuat...
                    </SelectItem>
                  )}
                  {options.categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="hover:bg-black/5 focus:bg-black/5">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.categories && <p className="text-xs text-rose-600">{fieldErrors.categories}</p>}
            </div>

            {/* Technologies - Creatable Multi-Select */}
            <div className="space-y-2">
              <Label htmlFor="technologies" className="text-black">
                Technologies
              </Label>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-1 rounded-lg border border-black/10 bg-white p-1.5">
                  {/* Selected techs as chips */}
                  {form.technologies.map((tech) => (
                    <span key={tech} className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-amber-100 px-2 py-0.5 text-xs font-medium text-black">
                      {tech}
                      <button type="button" onClick={() => handleRemoveTech(tech)} className="inline-flex items-center text-black/60 hover:text-black">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {/* Single input for search & typing */}
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onFocus={() => setTechOpen(true)}
                    onBlur={() => setTimeout(() => setTechOpen(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder={form.technologies.length === 0 ? "Ketik untuk mencari atau tambah teknologi..." : ""}
                    className="min-w-30 flex-1 bg-transparent px-1 py-1 text-sm text-black outline-none placeholder:text-black/40"
                  />
                </div>

                {/* Floating options list */}
                {(techOpen || techInput) && (
                  <div className="absolute left-0 right-0 z-50 mt-1 max-h-50 overflow-y-auto rounded-lg border border-black/10 bg-white shadow-xl">
                    {techSearchResults.length === 0 && techInput.trim() ? (
                      <button type="button" onClick={() => handleAddTech(techInput.trim())} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-bold text-black hover:bg-amber-100">
                        <PlusCircle className="h-4 w-4" />
                        Tambah &quot;{techInput.trim()}&quot;
                      </button>
                    ) : techSearchResults.length === 0 && !techInput.trim() ? (
                      <p className="px-3 py-6 text-center text-sm text-black">{options.skills.length === 0 ? "Memuat..." : "Ketik untuk mencari teknologi"}</p>
                    ) : (
                      techSearchResults.map((tech) => (
                        <button key={tech} type="button" onClick={() => handleAddTech(tech)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-black transition hover:bg-black/5">
                          <Check className={cn("h-4 w-4 shrink-0", form.technologies.includes(tech) ? "opacity-100 text-brand-400" : "opacity-0")} />
                          <span>{tech}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-black">Klik option atau Enter untuk menambah</p>
              {fieldErrors.technologies && <p className="text-xs text-rose-600">{fieldErrors.technologies}</p>}
            </div>
          </div>

          {/* Upload + Preview - Larger area */}
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-3 rounded-2xl border border-dashed border-black/20 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-black">
                <ImageUp className="h-4 w-4 text-amber-600" />
                Image project
              </div>
              <p className="text-sm text-black">Pilih file JPG, PNG, WEBP, atau SVG. File akan diupload ke MinIO saat klik Simpan.</p>
              <ImageUploader folder="projects" currentUrl={form.image} onUrlChange={(url) => updateField("image", url)} onPendingFile={handleImageFileSelect} label="Upload image project ke MinIO/CDN (otomatis saat Simpan)" />
            </div>

            {/* Preview - Larger */}
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/5">
              <div className="flex h-full min-h-60 items-center justify-center">
                {pendingImageFile || form.image ? (
                  <Image src={pendingImageFile && previewBlobUrl ? previewBlobUrl : form.image} alt="Preview image project" width={400} height={280} className="h-full min-h-60 w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                    <div className="rounded-xl border border-dashed border-black/20 bg-white p-4">
                      <ImageUp className="mx-auto h-8 w-8 text-black/30" />
                    </div>
                    <p className="text-sm text-black">Preview akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* URL Fields - Single Column */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="urlPreview" className="text-black">
                Preview URL
              </Label>
              <Input
                id="urlPreview"
                value={form.urlPreview}
                onChange={(e) => updateField("urlPreview", e.target.value)}
                className={`border border-black/10 bg-white text-black placeholder:text-black/40 ${fieldErrors.urlPreview ? "border-rose-500/60!" : ""}`}
                placeholder="https://kaftan-brautmode.de/de"
              />
              {fieldErrors.urlPreview && <p className="text-xs text-rose-600">{fieldErrors.urlPreview}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-black">
                Github URL
              </Label>
              <Input
                id="githubUrl"
                value={form.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                className={`border border-black/10 bg-white text-black placeholder:text-black/40 ${fieldErrors.githubUrl ? "border-rose-500/60!" : ""}`}
                placeholder="https://github.com/mohagussetiaone/..."
              />
              {fieldErrors.githubUrl && <p className="text-xs text-rose-600">{fieldErrors.githubUrl}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="figmaUrl" className="text-black">
                Figma URL
              </Label>
              <Input
                id="figmaUrl"
                value={form.figmaUrl}
                onChange={(e) => updateField("figmaUrl", e.target.value)}
                className={`border border-black/10 bg-white text-black placeholder:text-black/40 ${fieldErrors.figmaUrl ? "border-rose-500/60!" : ""}`}
                placeholder="https://figma.com/..."
              />
              {fieldErrors.figmaUrl && <p className="text-xs text-rose-600">{fieldErrors.figmaUrl}</p>}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black transition-colors hover:bg-black/5">
            <input type="checkbox" checked={form.internal} onChange={(e) => updateField("internal", e.target.checked)} className="h-4 w-4 rounded border border-black/20 accent-amber-400" />
            Tandai sebagai internal project
          </label>

          <Separator className="bg-black/10" />

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4">
              <div className="flex items-center gap-2 text-black">
                <Globe2 className="h-4 w-4 text-amber-600" />
                <h3 className="font-semibold">Bahasa Indonesia</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectNameId" className="text-black">
                  Nama Project
                </Label>
                <Input
                  id="projectNameId"
                  value={form.translations.id.projectName}
                  onChange={(e) => updateTranslation("id", "projectName", e.target.value)}
                  className={`border border-black/10 bg-white text-black placeholder:text-black/40 ${fieldErrors["translations.id.projectName"] ? "border-rose-500/60!" : ""}`}
                />
                {fieldErrors["translations.id.projectName"] && <p className="text-xs text-rose-600">{fieldErrors["translations.id.projectName"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionId" className="text-black">
                  Deskripsi
                </Label>
                <Textarea
                  id="descriptionId"
                  value={form.translations.id.description}
                  onChange={(e) => updateTranslation("id", "description", e.target.value)}
                  className={`border border-black/10 bg-white text-black min-h-25 placeholder:text-black/40 ${fieldErrors["translations.id.description"] ? "border-rose-500/60!" : ""}`}
                />
                {fieldErrors["translations.id.description"] && <p className="text-xs text-rose-600">{fieldErrors["translations.id.description"]}</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4">
              <div className="flex items-center gap-2 text-black">
                <Globe2 className="h-4 w-4 text-sky-600" />
                <h3 className="font-semibold">English</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectNameEn" className="text-black">
                  Project Name
                </Label>
                <Input
                  id="projectNameEn"
                  value={form.translations.en.projectName}
                  onChange={(e) => updateTranslation("en", "projectName", e.target.value)}
                  className={`border border-black/10 bg-white text-black placeholder:text-black/40 ${fieldErrors["translations.en.projectName"] ? "border-rose-500/60!" : ""}`}
                />
                {fieldErrors["translations.en.projectName"] && <p className="text-xs text-rose-600">{fieldErrors["translations.en.projectName"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn" className="text-black">
                  Description
                </Label>
                <Textarea
                  id="descriptionEn"
                  value={form.translations.en.description}
                  onChange={(e) => updateTranslation("en", "description", e.target.value)}
                  className={`border border-black/10 bg-white text-black min-h-25 placeholder:text-black/40 ${fieldErrors["translations.en.description"] ? "border-rose-500/60!" : ""}`}
                />
                {fieldErrors["translations.en.description"] && <p className="text-xs text-rose-600">{fieldErrors["translations.en.description"]}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {error && <p className="rounded-xl border border-rose-500/30 bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</p>}
            {success && <p className="rounded-xl border border-emerald-500/30 bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{success}</p>}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleClose} className="rounded-full border border-black/10 bg-transparent text-black hover:bg-black/5">
                Batal
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-full border border-black bg-amber-400 px-8 text-black hover:bg-amber-300 font-bold">
                {isPending ? "Menyimpan..." : mode === "edit" ? "Update Project" : "Simpan Project"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
