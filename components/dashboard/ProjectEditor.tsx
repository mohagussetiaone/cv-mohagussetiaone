"use client";

import { useMemo, useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Globe2, ImageUp, Languages, PencilLine, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import type { ProjectRecord } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { deleteImageByUrl } from "@/lib/upload-client";
import { projectPayloadSchema } from "@/lib/validators/project";
import { cn } from "@/lib/utils";

type ProjectEditorProps = {
  project?: ProjectRecord | null;
  locale: string;
};

type OptionsData = {
  skills: string[];
  categories: string[];
};

// Parse githubUrl: could be plain URL or JSON {"frontend":"...","backend":"..."}
const parseGithubUrls = (raw: string | null | undefined): { frontend: string; backend: string } => {
  if (!raw) return { frontend: "", backend: "" };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && (parsed.frontend || parsed.backend)) {
      return { frontend: parsed.frontend ?? "", backend: parsed.backend ?? "" };
    }
  } catch {
    // Not JSON — plain URL
  }
  return { frontend: raw, backend: "" };
};

const createInitialState = (project?: ProjectRecord | null) => {
  const urls = parseGithubUrls(project?.githubUrl);
  return {
    projectName: project?.projectName ?? "",
    image: project?.image ?? "",
    urlPreview: project?.urlPreview ?? "",
    githubUrlFrontend: urls.frontend,
    githubUrlBackend: urls.backend,
    figmaUrl: project?.figmaUrl ?? "",
    technologies: project?.technologies ?? [],
    categories: project?.categories ?? [],
    internal: project?.internal ?? false,
    techStack: project?.techStack ?? "",
    deployment: project?.deployment ?? "",
    server: project?.server ?? "",
    designMethod: project?.designMethod ?? "",
    orm: project?.orm ?? "",
    database: project?.database ?? "",
    domainProvider: project?.domainProvider ?? "",
    translations: {
      id: {
        description: project?.translations.id?.description ?? "",
      },
      en: {
        description: project?.translations.en?.description ?? "",
      },
    },
  };
};

export function ProjectEditor({ project, locale }: ProjectEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(() => createInitialState(project));
  const [options, setOptions] = useState<OptionsData>({ skills: [], categories: [] });
  const [techInput, setTechInput] = useState("");
  const [techOpen, setTechOpen] = useState(false);
  const [catInput, setCatInput] = useState("");
  const [catOpen, setCatOpen] = useState(false);

  // Fetch options from DB
  useEffect(() => {
    fetch("/api/dashboard/options")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch options");
        return res.json();
      })
      .then((data) => {
        if (data?.skills) setOptions(data);
      })
      .catch((err) => console.error("Failed to load editor options:", err));
  }, []);

  // Update form when project prop changes
  useEffect(() => {
    setForm(createInitialState(project));
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  }, [project]);

  const mode = useMemo(() => (project ? "edit" : "create"), [project]);

  const handleBack = () => {
    router.push(`/${locale}/dashboard/project`);
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

  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  const handleImageFileSelect = (file: File | null) => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    if (file) {
      setPreviewBlobUrl(URL.createObjectURL(file));
    }
    setPendingImageFile(file);
  };

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

  // ─── Categories: Creatable Single Select ───────────────────
  const availableCats = useMemo(() => options.categories.filter((c) => c !== form.categories[0]), [options.categories, form.categories]);
  const catSearchResults = useMemo(() => availableCats.filter((c) => c.toLowerCase().includes(catInput.toLowerCase())), [availableCats, catInput]);

  const handleSelectCategory = useCallback((cat: string) => {
    setForm((prev) => ({ ...prev, categories: [cat] }));
    setCatInput("");
    setCatOpen(false);
  }, []);

  const handleRemoveCategory = useCallback(() => {
    setForm((prev) => ({ ...prev, categories: [] }));
  }, []);

  const handleCatKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && catInput.trim()) {
        e.preventDefault();
        handleSelectCategory(catInput.trim());
      }
      if (e.key === "Backspace" && !catInput && form.categories.length > 0) {
        handleRemoveCategory();
      }
    },
    [catInput, form.categories, handleSelectCategory, handleRemoveCategory],
  );

  // ─── Technologies: Creatable Multi-Select ──────────────────
  const availableTechs = useMemo(() => options.skills.filter((s) => !form.technologies.includes(s)), [options.skills, form.technologies]);
  const techSearchResults = useMemo(() => availableTechs.filter((s) => s.toLowerCase().includes(techInput.toLowerCase())), [availableTechs, techInput]);

  const handleAddTech = useCallback(
    (tech: string) => {
      if (!form.technologies.includes(tech)) {
        setForm((prev) => ({ ...prev, technologies: [...prev.technologies, tech] }));
      }
      setTechInput("");
    },
    [form.technologies],
  );

  const handleRemoveTech = useCallback((tech: string) => {
    setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }));
  }, []);

  const handleTechKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && techInput.trim()) {
        e.preventDefault();
        handleAddTech(techInput.trim());
      }
    },
    [techInput, handleAddTech],
  );

  // ─── Validation & Submit ───────────────────────────────────
  const validateForm = (): Record<string, string> | null => {
    const result = projectPayloadSchema.safeParse({
      projectName: form.projectName,
      image: form.image,
      urlPreview: form.urlPreview,
      githubUrl: (() => {
        const fe = form.githubUrlFrontend.trim();
        const be = form.githubUrlBackend.trim();
        if (fe && be) return JSON.stringify({ frontend: fe, backend: be });
        return fe || be || "";
      })(),
      figmaUrl: form.figmaUrl,
      internal: form.internal,
      techStack: form.techStack || undefined,
      deployment: form.deployment || undefined,
      server: form.server || undefined,
      designMethod: form.designMethod || undefined,
      orm: form.orm || undefined,
      database: form.database || undefined,
      domainProvider: form.domainProvider || undefined,
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
    const validationErrors = validateForm();
    if (validationErrors) {
      setFieldErrors(validationErrors);
      setError("Periksa kembali isian form: " + Object.values(validationErrors)[0]);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      let uploadedNewUrl: string | null = null;
      try {
        const newImage = pendingImageFile ? await uploadPendingImage() : form.image;
        if (newImage && newImage !== form.image) {
          uploadedNewUrl = newImage;
        }
        const endpoint = mode === "edit" && project ? `/api/projects/${project.productId}` : "/api/projects";
        const method = mode === "edit" ? "PATCH" : "POST";
        const githubUrl = (() => {
          const fe = form.githubUrlFrontend.trim();
          const be = form.githubUrlBackend.trim();
          if (fe && be) return JSON.stringify({ frontend: fe, backend: be });
          return fe || be || "";
        })();
        const body = {
          projectName: form.projectName,
          image: newImage,
          urlPreview: form.urlPreview,
          githubUrl,
          figmaUrl: form.figmaUrl,
          internal: form.internal,
          techStack: form.techStack || undefined,
          deployment: form.deployment || undefined,
          server: form.server || undefined,
          designMethod: form.designMethod || undefined,
          orm: form.orm || undefined,
          database: form.database || undefined,
          domainProvider: form.domainProvider || undefined,
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
          if (uploadedNewUrl) await deleteImageByUrl(uploadedNewUrl);
          setError(payload?.message || "Gagal menyimpan project.");
          return;
        }
        if (uploadedNewUrl && form.image && form.image !== uploadedNewUrl) {
          await deleteImageByUrl(form.image);
        }
        if (newImage !== form.image) updateField("image", newImage);
        setSuccess(mode === "edit" ? "Project berhasil diperbarui." : "Project berhasil ditambahkan.");
        if (mode === "create") setForm(createInitialState());
        router.refresh();
        setTimeout(handleBack, 1500);
      } catch (err) {
        if (uploadedNewUrl) await deleteImageByUrl(uploadedNewUrl);
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  };

  // ─── Reusable input classes ────────────────────────────────
  const inputCls = "border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40";
  const chipCls = "inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700/50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200";
  const dropdownCls = "absolute left-0 right-0 z-50 mt-1 max-h-50 overflow-y-auto rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-lg";
  const dropdownItemCls = "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors";

  return (
    <main className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/dashboard/project`}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="gap-1 bg-amber-100 dark:bg-amber-900/40 text-black dark:text-amber-200 border-0">
                {mode === "edit" ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
                {mode === "edit" ? "Edit Mode" : "Create Mode"}
              </Badge>
              <Badge variant="outline" className="gap-1 border border-black/10 dark:border-white/15 text-gray-900 dark:text-gray-100">
                <Languages className="h-3.5 w-3.5" />
                ID + EN
              </Badge>
            </div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900 dark:text-gray-100">{mode === "edit" ? "Perbarui Project" : "Tambah Project Baru"}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {mode === "edit" ? `Edit project #${project?.productId.slice(0, 8) ?? ""}` : "Isi form di bawah untuk menambahkan project baru."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Project Name (Single, not bilingual) */}
        <div className="space-y-2">
          <Label htmlFor="projectName" className="text-gray-900 dark:text-gray-100">
            Nama Project
          </Label>
          <Input
            id="projectName"
            value={form.projectName}
            onChange={(e) => updateField("projectName", e.target.value)}
            className={cn(inputCls, fieldErrors.projectName && "border-rose-500/60!")}
            placeholder="Nama project Anda"
          />
          {fieldErrors.projectName && <p className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors.projectName}</p>}
        </div>

        {/* Categories (Creatable Single-Select) + Technologies (Creatable Multi-Select) */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* ── Categories ── */}
          <div className="space-y-2">
            <Label htmlFor="categories" className="text-gray-900 dark:text-gray-100">
              Categories
            </Label>
            <div className="relative">
              {/* Selected category as chip */}
              {form.categories.length > 0 && (
                <div className="mb-1.5">
                  <span className={chipCls}>
                    {form.categories[0]}
                    <button type="button" onClick={handleRemoveCategory} className="inline-flex items-center text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                </div>
              )}
              {/* Input */}
              <input
                type="text"
                value={catInput}
                onChange={(e) => { setCatInput(e.target.value); setCatOpen(true); }}
                onFocus={() => setCatOpen(true)}
                onBlur={() => setTimeout(() => setCatOpen(false), 200)}
                onKeyDown={handleCatKeyDown}
                placeholder={form.categories.length === 0 ? "Pilih atau ketik kategori baru..." : "Ganti kategori..."}
                className={cn("w-full rounded-lg px-3 py-2 text-sm outline-none", inputCls)}
              />
              {/* Dropdown */}
              {catOpen && (
                <div className={dropdownCls}>
                  {catSearchResults.length === 0 && catInput.trim() ? (
                    <button type="button" onClick={() => handleSelectCategory(catInput.trim())} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                      <PlusCircle className="h-4 w-4" />
                      Buat &quot;{catInput.trim()}&quot;
                    </button>
                  ) : catSearchResults.length === 0 && !catInput.trim() ? (
                    <p className="px-3 py-6 text-center text-sm text-gray-400 dark:text-zinc-500">{options.categories.length === 0 ? "Memuat..." : "Ketik untuk mencari atau buat kategori baru"}</p>
                  ) : (
                    catSearchResults.map((cat) => (
                      <button key={cat} type="button" onClick={() => handleSelectCategory(cat)} className={dropdownItemCls}>
                        <Check className={cn("h-4 w-4 shrink-0", form.categories.includes(cat) ? "opacity-100 text-emerald-600 dark:text-emerald-400" : "opacity-0")} />
                        <span>{cat}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-black/50 dark:text-white/40">Pilih dari daftar atau ketik nama baru</p>
            {fieldErrors.categories && <p className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors.categories}</p>}
          </div>

          {/* ── Technologies ── */}
          <div className="space-y-2">
            <Label htmlFor="technologies" className="text-gray-900 dark:text-gray-100">
              Technologies
            </Label>
            <div className="relative">
              <div className={cn("flex flex-wrap items-center gap-1 rounded-lg border p-1.5", "border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800")}>
                {form.technologies.map((tech) => (
                  <span key={tech} className={chipCls}>
                    {tech}
                    <button type="button" onClick={() => handleRemoveTech(tech)} className="inline-flex items-center text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onFocus={() => setTechOpen(true)}
                  onBlur={() => setTimeout(() => setTechOpen(false), 200)}
                  onKeyDown={handleTechKeyDown}
                  placeholder={form.technologies.length === 0 ? "Ketik untuk mencari atau tambah teknologi..." : ""}
                  className="min-w-30 flex-1 bg-transparent px-1 py-1 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                />
              </div>
              {techOpen && (
                <div className={dropdownCls}>
                  {techSearchResults.length === 0 && techInput.trim() ? (                      <button type="button" onClick={() => handleAddTech(techInput.trim())} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                      <PlusCircle className="h-4 w-4" />
                      Tambah &quot;{techInput.trim()}&quot;
                    </button>
                  ) : techSearchResults.length === 0 && !techInput.trim() ? (
                    <p className="px-3 py-6 text-center text-sm text-gray-400 dark:text-zinc-500">{options.skills.length === 0 ? "Memuat..." : "Ketik untuk mencari teknologi"}</p>
                  ) : (
                    techSearchResults.map((tech) => (
                      <button key={tech} type="button" onClick={() => handleAddTech(tech)} className={dropdownItemCls}>
                        <Check className={cn("h-4 w-4 shrink-0", form.technologies.includes(tech) ? "opacity-100 text-emerald-600 dark:text-emerald-400" : "opacity-0")} />
                        <span>{tech}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500">Klik option atau Enter untuk menambah</p>
            {fieldErrors.technologies && <p className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors.technologies}</p>}
          </div>
        </div>

        {/* Upload + Preview */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <ImageUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Image project
            </div>              <p className="text-sm text-gray-500 dark:text-zinc-400">Pilih file JPG, PNG, WEBP, atau SVG. File akan diupload ke MinIO saat klik Simpan.</p>
            <ImageUploader folder="projects" currentUrl={form.image} onUrlChange={(url) => updateField("image", url)} onPendingFile={handleImageFileSelect} label="Upload image project ke MinIO/CDN (otomatis saat Simpan)" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
            <div className="flex h-full min-h-60 items-center justify-center">
              {pendingImageFile || form.image ? (
                <Image src={pendingImageFile && previewBlobUrl ? previewBlobUrl : form.image} alt="Preview image project" width={400} height={280} className="h-full min-h-60 w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                  <div className="rounded-xl border border-dashed border-black/20 dark:border-white/15 bg-white dark:bg-neutral-900 p-4">
                    <ImageUp className="mx-auto h-8 w-8 text-gray-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-zinc-500">Preview akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* URL Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="urlPreview" className="text-gray-900 dark:text-gray-100">Preview URL</Label>
            <Input id="urlPreview" value={form.urlPreview} onChange={(e) => updateField("urlPreview", e.target.value)} className={cn(inputCls, fieldErrors.urlPreview && "border-rose-500/60!")} placeholder="https://kaftan-brautmode.de/de" />
            {fieldErrors.urlPreview && <p className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors.urlPreview}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="figmaUrl" className="text-gray-900 dark:text-gray-100">Figma URL</Label>
            <Input id="figmaUrl" value={form.figmaUrl} onChange={(e) => updateField("figmaUrl", e.target.value)} className={cn(inputCls, fieldErrors.figmaUrl && "border-rose-500/60!")} placeholder="https://figma.com/..." />
            {fieldErrors.figmaUrl && <p className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors.figmaUrl}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrlFrontend" className="text-gray-900 dark:text-gray-100">GitHub URL (Frontend)</Label>
            <Input id="githubUrlFrontend" value={form.githubUrlFrontend} onChange={(e) => updateField("githubUrlFrontend", e.target.value)} className={inputCls} placeholder="https://github.com/mohagussetiaone/frontend-repo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrlBackend" className="text-gray-900 dark:text-gray-100">GitHub URL (Backend)</Label>
            <Input id="githubUrlBackend" value={form.githubUrlBackend} onChange={(e) => updateField("githubUrlBackend", e.target.value)} className={inputCls} placeholder="https://github.com/mohagussetiaone/backend-repo" />
          </div>
        </div>

        {/* Tech Detail Fields */}
        <div className="space-y-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tech Details <span className="text-black/40 dark:text-white/30 font-normal">(opsional)</span></h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 dark:text-zinc-400">Tech Stack</Label>
              <Input value={form.techStack} onChange={(e) => updateField("techStack", e.target.value)} className={inputCls} placeholder="React, Next.js, Tailwind CSS" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 dark:text-zinc-400">Deployment</Label>
              <Input value={form.deployment} onChange={(e) => updateField("deployment", e.target.value)} className={inputCls} placeholder="Vercel, Netlify" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 dark:text-zinc-400">Server</Label>
              <Input value={form.server} onChange={(e) => updateField("server", e.target.value)} className={inputCls} placeholder="Node.js, Express" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 dark:text-zinc-400">Desain / AI Agent</Label>
              <Input value={form.designMethod} onChange={(e) => updateField("designMethod", e.target.value)} className={inputCls} placeholder="Figma, ChatGPT, Claude" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 dark:text-zinc-400">ORM</Label>
              <Input value={form.orm} onChange={(e) => updateField("orm", e.target.value)} className={inputCls} placeholder="Prisma, Drizzle" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 dark:text-zinc-400">Database</Label>
              <Input value={form.database} onChange={(e) => updateField("database", e.target.value)} className={inputCls} placeholder="PostgreSQL, MongoDB" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 dark:text-zinc-400">Domain Provider</Label>
              <Input value={form.domainProvider} onChange={(e) => updateField("domainProvider", e.target.value)} className={inputCls} placeholder="Cloudflare, Namecheap" />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5">
          <input type="checkbox" checked={form.internal} onChange={(e) => updateField("internal", e.target.checked)} className="h-4 w-4 rounded border border-black/20 dark:border-white/20 accent-amber-400" />
          Tandai sebagai internal project
        </label>

        <Separator className="bg-black/10 dark:bg-white/10" />

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Globe2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold">Deskripsi Indonesia</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionId" className="text-gray-900 dark:text-gray-100">Deskripsi</Label>
              <Textarea id="descriptionId" value={form.translations.id.description} onChange={(e) => updateTranslation("id", "description", e.target.value)} className={cn(inputCls, "min-h-25", fieldErrors["translations.id.description"] && "border-rose-500/60!")} placeholder="Deskripsi project dalam Bahasa Indonesia..." />
              {fieldErrors["translations.id.description"] && <p className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors["translations.id.description"]}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Globe2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <h3 className="font-semibold">Description (English)</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionEn" className="text-gray-900 dark:text-gray-100">Description</Label>
              <Textarea id="descriptionEn" value={form.translations.en.description} onChange={(e) => updateTranslation("en", "description", e.target.value)} className={cn(inputCls, "min-h-25", fieldErrors["translations.en.description"] && "border-rose-500/60!")} placeholder="Project description in English..." />
              {fieldErrors["translations.en.description"] && <p className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors["translations.en.description"]}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {error && <p className="rounded-xl border border-rose-500/30 bg-rose-100 dark:bg-rose-900/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">{error}</p>}
          {success && <p className="rounded-xl border border-emerald-500/30 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">{success}</p>}

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleBack} className="rounded-full border border-black/10 dark:border-white/15 bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-full border border-black bg-amber-400 px-8 text-black hover:bg-amber-300 font-bold">
              {isPending ? "Menyimpan..." : mode === "edit" ? "Update Project" : "Simpan Project"}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
