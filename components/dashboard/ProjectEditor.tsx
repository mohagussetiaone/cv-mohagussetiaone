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

export function ProjectEditor({
  project,
  isOpen,
  onSaved,
}: ProjectEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateTranslation = (locale: "id" | "en", field: "projectName" | "description", value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], [field]: value },
      },
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    startUploadTransition(async () => {
      const payload = new FormData();
      payload.append("file", file);
      const response = await fetch("/api/uploads/project-image", { method: "POST", body: payload });
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

  // Filter out already selected technologies for the dropdown
  const availableTechs = useMemo(
    () => options.skills.filter((s) => !form.technologies.includes(s)),
    [options.skills, form.technologies]
  );

  const techSearchResults = useMemo(
    () => availableTechs.filter((s) => s.toLowerCase().includes(techInput.toLowerCase())),
    [availableTechs, techInput]
  );

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
    [form.technologies]
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
    [techInput, handleAddTech]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const endpoint = mode === "edit" && project ? `/api/projects/${project.productId}` : "/api/projects";
      const method = mode === "edit" ? "PATCH" : "POST";

      const body = {
        image: form.image,
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
        setError(payload?.message || "Gagal menyimpan project.");
        return;
      }

      setSuccess(mode === "edit" ? "Project berhasil diperbarui." : "Project berhasil ditambahkan.");
      onSaved?.();

      if (mode === "create") {
        setForm(createInitialState());
      }

      router.refresh();
      setTimeout(handleClose, 1500);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
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
            {mode === "edit"
              ? `Edit project #${project?.productId ?? ""}`
              : "Simpan konten dinamis project per locale."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Categories (Select) + Technologies (Creatable Multi-Select) */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Categories */}
            <div className="space-y-2">
              <Label htmlFor="categories" className="text-white/80">Categories</Label>
              <Select
                value={form.categories[0] ?? ""}
                onValueChange={(val) => updateField("categories", [val])}
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent className="z-[60] border-white/10 bg-[#1a1a2e] text-white">
                  {options.categories.length === 0 && (
                    <SelectItem value="__loading" disabled>
                      Memuat...
                    </SelectItem>
                  )}
                  {options.categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="hover:bg-white/10 focus:bg-white/10">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Technologies - Creatable Multi-Select */}
            <div className="space-y-2">
              <Label htmlFor="technologies" className="text-white/80">Technologies</Label>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1.5">
                  {/* Selected techs as chips */}
                  {form.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-md bg-brand-500/15 px-2 py-0.5 text-xs font-medium text-brand-400"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="inline-flex items-center text-brand-400/60 hover:text-brand-300"
                      >
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
                    className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-white outline-none placeholder:text-white/40"
                  />
                </div>

                {/* Floating options list */}
                {(techOpen || techInput) && (
                  <div className="absolute left-0 right-0 z-50 mt-1 max-h-[200px] overflow-y-auto rounded-lg border border-white/10 bg-[#1a1a2e] shadow-xl">
                    {techSearchResults.length === 0 && techInput.trim() ? (
                      <button
                        type="button"
                        onClick={() => handleAddTech(techInput.trim())}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-brand-400 hover:bg-white/5"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Tambah &quot;{techInput.trim()}&quot;
                      </button>
                    ) : techSearchResults.length === 0 && !techInput.trim() ? (
                      <p className="px-3 py-6 text-center text-sm text-white/40">
                        {options.skills.length === 0 ? "Memuat..." : "Ketik untuk mencari teknologi"}
                      </p>
                    ) : (
                      techSearchResults.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => handleAddTech(tech)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
                        >
                          <Check
                            className={cn(
                              "h-4 w-4 shrink-0",
                              form.technologies.includes(tech) ? "opacity-100 text-brand-400" : "opacity-0"
                            )}
                          />
                          <span>{tech}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-white/40">Klik option atau Enter untuk menambah</p>
            </div>
          </div>

          {/* Upload + Preview - Larger area */}
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5">
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

            {/* Preview - Larger */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <div className="flex h-full min-h-[240px] items-center justify-center">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt="Preview image project"
                    width={400}
                    height={280}
                    className="h-full min-h-[240px] w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4">
                      <ImageUp className="mx-auto h-8 w-8 text-white/20" />
                    </div>
                    <p className="text-sm text-white/35">
                      Preview akan muncul di sini
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image URL Field - always visible */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-white/80">Image URL</Label>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className="border-white/10 bg-white/5"
              placeholder="https://cdn.domain.com/projects/..."
            />
          </div>

          {/* URL Fields - Single Column */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="urlPreview" className="text-white/80">Preview URL</Label>
              <Input
                id="urlPreview"
                value={form.urlPreview}
                onChange={(e) => updateField("urlPreview", e.target.value)}
                className="border-white/10 bg-white/5"
                placeholder="https://kaftan-brautmode.de/de"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-white/80">Github URL</Label>
              <Input
                id="githubUrl"
                value={form.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                className="border-white/10 bg-white/5"
                placeholder="https://github.com/mohagussetiaone/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="figmaUrl" className="text-white/80">Figma URL</Label>
              <Input
                id="figmaUrl"
                value={form.figmaUrl}
                onChange={(e) => updateField("figmaUrl", e.target.value)}
                className="border-white/10 bg-white/5"
                placeholder="https://figma.com/..."
              />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/10">
            <input
              type="checkbox"
              checked={form.internal}
              onChange={(e) => updateField("internal", e.target.checked)}
              className="h-4 w-4 rounded border-white/10"
            />
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
                <Input
                  id="projectNameId"
                  value={form.translations.id.projectName}
                  onChange={(e) => updateTranslation("id", "projectName", e.target.value)}
                  className="border-white/10 bg-black/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionId" className="text-white/70">Deskripsi</Label>
                <Textarea
                  id="descriptionId"
                  value={form.translations.id.description}
                  onChange={(e) => updateTranslation("id", "description", e.target.value)}
                  className="border-white/10 bg-black/20 min-h-[100px]"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Globe2 className="h-4 w-4 text-sky-400" />
                <h3 className="font-semibold">English</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectNameEn" className="text-white/70">Project Name</Label>
                <Input
                  id="projectNameEn"
                  value={form.translations.en.projectName}
                  onChange={(e) => updateTranslation("en", "projectName", e.target.value)}
                  className="border-white/10 bg-black/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn" className="text-white/70">Description</Label>
                <Textarea
                  id="descriptionEn"
                  value={form.translations.en.description}
                  onChange={(e) => updateTranslation("en", "description", e.target.value)}
                  className="border-white/10 bg-black/20 min-h-[100px]"
                />
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
