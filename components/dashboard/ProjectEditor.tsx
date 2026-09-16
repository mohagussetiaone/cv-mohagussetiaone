"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Globe2, ImageUp, Languages, PencilLine, PlusCircle } from "lucide-react";
import Link from "next/link";
import type { ProjectRecord } from "@/app/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { deleteImageByUrl } from "@/lib/upload-client";
import { projectPayloadSchema } from "@/lib/validators/project";
import { cn } from "@/lib/utils";
import { useNeo, NEO } from "@/components/dashboard/neo";

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
  const { isNeo } = useNeo();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(() => createInitialState(project));
  const [options, setOptions] = useState<OptionsData>({ skills: [], categories: [] });

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
  const inputCls = isNeo
    ? NEO.input
    : "border border-black/10 dark:border-white/10 bg-white dark:bg-[#121826] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40";

  return (
    <main className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <div className={cn("relative overflow-hidden p-6", isNeo ? "border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_black]" : "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e]")}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/dashboard/project`}
                className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors", isNeo ? "font-bold text-black hover:bg-amber-100" : "rounded-lg text-black hover:bg-black/5")}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className={cn("gap-1 border-0", isNeo ? "border-2 border-black bg-amber-400 font-bold text-black" : "bg-amber-400 text-black")}>
                {mode === "edit" ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
                {mode === "edit" ? "Edit Mode" : "Create Mode"}
              </Badge>
              <Badge variant="outline" className={cn("gap-1", isNeo ? "border-2 border-black bg-white font-bold text-black" : "border border-black/10 text-black")}>
                <Languages className="h-3.5 w-3.5" />
                ID + EN
              </Badge>
            </div>
            <h1 className={cn("mt-3 text-xl font-semibold", isNeo ? "text-black" : "text-black")}>{mode === "edit" ? "Perbarui Project" : "Tambah Project Baru"}</h1>
            <p className={cn("mt-1 text-sm", isNeo ? "text-black" : "text-black/60")}>{mode === "edit" ? `Edit project #${project?.productId.slice(0, 8) ?? ""}` : "Isi form di bawah untuk menambahkan project baru."}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Project Name (Single, not bilingual) */}
        <div className="space-y-2">
          <Label htmlFor="projectName" className={cn(isNeo ? "font-bold text-black" : "text-black")}>
            Nama Project
          </Label>
          <Input id="projectName" value={form.projectName} onChange={(e) => updateField("projectName", e.target.value)} className={cn(inputCls, fieldErrors.projectName && "border-rose-500/60!")} placeholder="Nama project Anda" />
          {fieldErrors.projectName && <p className="text-xs text-rose-600">{fieldErrors.projectName}</p>}
        </div>

        {/* Categories (Single Select) */}
        <div className="space-y-2">
          <Label htmlFor="categories" className={cn(isNeo ? "font-bold text-black" : "text-black dark:text-white")}>
            Categories
          </Label>
          <Select value={form.categories[0] ?? ""} onValueChange={(val) => setForm((prev) => ({ ...prev, categories: val ? [val] : [] }))}>
            <SelectTrigger
              id="categories"
              className={cn(
                "w-full rounded-lg text-sm",
                isNeo ? NEO.input : "border border-black/10 dark:border-white/10 bg-white dark:bg-[#121826] text-black dark:text-white focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40",
                fieldErrors.categories && "border-rose-500/60!",
              )}
            >
              <SelectValue placeholder="-- Pilih kategori --" />
            </SelectTrigger>
            <SelectContent className={cn(isNeo ? "border-[3px] border-black bg-white text-black shadow-[4px_4px_0px_0px_black]" : "border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e] text-black dark:text-white")}>
              <SelectItem value="__none__" disabled className="hidden" />
              {options.categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className={cn("rounded-lg text-sm cursor-pointer", isNeo ? "focus:bg-amber-100 focus:text-black" : "focus:bg-amber-400/10 focus:text-amber-600 dark:focus:bg-amber-400/15 dark:focus:text-amber-400")}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className={cn("text-xs", isNeo ? "text-black/50" : "text-black/50 dark:text-white/50")}>Pilih dari daftar yang tersedia</p>
          {fieldErrors.categories && <p className="text-xs text-rose-600">{fieldErrors.categories}</p>}
        </div>

        {/* Upload + Preview */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className={cn("space-y-3 p-5", isNeo ? "border-[3px] border-black bg-white" : "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e]")}>
            <div className={cn("flex items-center gap-2 text-sm font-medium", isNeo ? "text-black" : "text-black dark:text-white")}>
              <ImageUp className="h-4 w-4 text-amber-600" />
              Image project
            </div>
            <ImageUploader folder="projects" currentUrl={form.image} onUrlChange={(url) => updateField("image", url)} onPendingFile={handleImageFileSelect} label="Upload image project ke MinIO/CDN (otomatis saat Simpan)" />
          </div>
          <div className={cn("overflow-hidden", isNeo ? "border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_black]" : "rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-[#121826]")}>
            <div className="flex h-full min-h-60 items-center justify-center">
              {pendingImageFile || form.image ? (
                <Image src={pendingImageFile && previewBlobUrl ? previewBlobUrl : form.image} alt="Preview image project" width={400} height={280} className="h-full min-h-60 w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                  <div className={cn("border border-dashed p-4", isNeo ? "border-2 border-black bg-white" : "rounded-xl border-black/20 dark:border-white/15 bg-white dark:bg-neutral-900")}>
                    <ImageUp className={cn("mx-auto h-8 w-8", isNeo ? "text-black/30" : "text-black/20")} />
                  </div>
                  <p className={cn("text-sm", isNeo ? "text-black/50" : "text-black/40")}>Preview akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* URL Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="urlPreview" className={cn(isNeo ? "font-bold text-black" : "text-black")}>
              Preview URL
            </Label>
            <Input id="urlPreview" value={form.urlPreview} onChange={(e) => updateField("urlPreview", e.target.value)} className={cn(inputCls, fieldErrors.urlPreview && "border-rose-500/60!")} placeholder="https://kaftan-brautmode.de/de" />
            {fieldErrors.urlPreview && <p className="text-xs text-rose-600">{fieldErrors.urlPreview}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="figmaUrl" className={cn(isNeo ? "font-bold text-black" : "text-black")}>
              Figma URL
            </Label>
            <Input id="figmaUrl" value={form.figmaUrl} onChange={(e) => updateField("figmaUrl", e.target.value)} className={cn(inputCls, fieldErrors.figmaUrl && "border-rose-500/60!")} placeholder="https://figma.com/..." />
            {fieldErrors.figmaUrl && <p className="text-xs text-rose-600">{fieldErrors.figmaUrl}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrlFrontend" className={cn(isNeo ? "font-bold text-black" : "text-black")}>
              GitHub URL (Frontend)
            </Label>
            <Input id="githubUrlFrontend" value={form.githubUrlFrontend} onChange={(e) => updateField("githubUrlFrontend", e.target.value)} className={inputCls} placeholder="https://github.com/mohagussetiaone/frontend-repo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrlBackend" className={cn(isNeo ? "font-bold text-black" : "text-black")}>
              GitHub URL (Backend)
            </Label>
            <Input id="githubUrlBackend" value={form.githubUrlBackend} onChange={(e) => updateField("githubUrlBackend", e.target.value)} className={inputCls} placeholder="https://github.com/mohagussetiaone/backend-repo" />
          </div>
        </div>

        {/* Tech Detail Fields */}
        <div className={cn("space-y-3 p-5", isNeo ? "border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_black]" : "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e]")}>
          <h3 className={cn("text-sm font-semibold", isNeo ? "text-black" : "text-black")}>
            Tech Details <span className={cn("font-normal", isNeo ? "text-black/40" : "text-black/40")}>(opsional)</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className={cn("text-xs", isNeo ? "font-bold text-black" : "text-black/60")}>Tech Stack</Label>
              <Input value={form.techStack} onChange={(e) => updateField("techStack", e.target.value)} className={inputCls} placeholder="React, Next.js, Tailwind CSS" />
            </div>
            <div className="space-y-1.5">
              <Label className={cn("text-xs", isNeo ? "font-bold text-black" : "text-black/60")}>Deployment</Label>
              <Input value={form.deployment} onChange={(e) => updateField("deployment", e.target.value)} className={inputCls} placeholder="Vercel, Netlify" />
            </div>
            <div className="space-y-1.5">
              <Label className={cn("text-xs", isNeo ? "font-bold text-black" : "text-black/60")}>Server</Label>
              <Input value={form.server} onChange={(e) => updateField("server", e.target.value)} className={inputCls} placeholder="Node.js, Express" />
            </div>
            <div className="space-y-1.5">
              <Label className={cn("text-xs", isNeo ? "font-bold text-black" : "text-black/60")}>Desain / AI Agent</Label>
              <Input value={form.designMethod} onChange={(e) => updateField("designMethod", e.target.value)} className={inputCls} placeholder="Figma, ChatGPT, Claude" />
            </div>
            <div className="space-y-1.5">
              <Label className={cn("text-xs", isNeo ? "font-bold text-black" : "text-black/60")}>ORM</Label>
              <Input value={form.orm} onChange={(e) => updateField("orm", e.target.value)} className={inputCls} placeholder="Prisma, Drizzle" />
            </div>
            <div className="space-y-1.5">
              <Label className={cn("text-xs", isNeo ? "font-bold text-black" : "text-black/60")}>Database</Label>
              <Input value={form.database} onChange={(e) => updateField("database", e.target.value)} className={inputCls} placeholder="PostgreSQL, MongoDB" />
            </div>
            <div className="space-y-1.5">
              <Label className={cn("text-xs", isNeo ? "font-bold text-black" : "text-black/60")}>Domain Provider</Label>
              <Input value={form.domainProvider} onChange={(e) => updateField("domainProvider", e.target.value)} className={inputCls} placeholder="Cloudflare, Namecheap" />
            </div>
          </div>
        </div>

        <label
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
            isNeo ? "border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_black] hover:bg-amber-100" : "rounded-2xl border border-black/10 bg-white text-black hover:bg-black/5",
          )}
        >
          <input type="checkbox" checked={form.internal} onChange={(e) => updateField("internal", e.target.checked)} className="h-4 w-4 rounded border border-black/20 accent-amber-400" />
          Tandai sebagai internal project
        </label>

        <Separator className="bg-black/10 dark:bg-white/10" />

        <div className="grid gap-6 xl:grid-cols-2">
          <div className={cn("p-5 space-y-4", isNeo ? "border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_black]" : "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e]")}>
            <div className={cn("flex items-center gap-2", isNeo ? "text-black" : "text-black")}>
              <Globe2 className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold">Deskripsi Indonesia</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionId" className={cn(isNeo ? "font-bold text-black" : "text-black")}>
                Deskripsi
              </Label>
              <Textarea
                id="descriptionId"
                value={form.translations.id.description}
                onChange={(e) => updateTranslation("id", "description", e.target.value)}
                className={cn(inputCls, "min-h-25", fieldErrors["translations.id.description"] && "border-rose-500/60!")}
                placeholder="Deskripsi project dalam Bahasa Indonesia..."
              />
              {fieldErrors["translations.id.description"] && <p className="text-xs text-rose-600">{fieldErrors["translations.id.description"]}</p>}
            </div>
          </div>

          <div className={cn("p-5 space-y-4", isNeo ? "border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_black]" : "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e]")}>
            <div className={cn("flex items-center gap-2", isNeo ? "text-black" : "text-black")}>
              <Globe2 className="h-4 w-4 text-sky-600" />
              <h3 className="font-semibold">Description (English)</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionEn" className={cn(isNeo ? "font-bold text-black" : "text-black")}>
                Description
              </Label>
              <Textarea
                id="descriptionEn"
                value={form.translations.en.description}
                onChange={(e) => updateTranslation("en", "description", e.target.value)}
                className={cn(inputCls, "min-h-25", fieldErrors["translations.en.description"] && "border-rose-500/60!")}
                placeholder="Project description in English..."
              />
              {fieldErrors["translations.en.description"] && <p className="text-xs text-rose-600">{fieldErrors["translations.en.description"]}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {error && <p className="rounded-xl border border-rose-500/30 bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</p>}
          {success && <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-black">{success}</p>}

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleBack} className={cn(isNeo ? NEO.btnOutline : "rounded-full border border-black/10 bg-transparent text-black hover:bg-black/5")}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className={cn(isNeo ? NEO.btn : "rounded-full border border-black bg-amber-400 px-8 text-black hover:bg-amber-300 font-bold")}>
              {isPending ? "Menyimpan..." : mode === "edit" ? "Update Project" : "Simpan Project"}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
