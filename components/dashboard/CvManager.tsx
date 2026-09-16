"use client";

import { useEffect, useState, useTransition } from "react";
import { FileUp, Trash2, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { deleteImageByUrl, uploadImageFile } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

type CvData = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  createdAt: string;
} | null;

type CvManagerProps = {
  locale: string;
};

export function CvManager({ locale }: CvManagerProps) {
  const [cv, setCv] = useState<CvData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSave] = useTransition();
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setCv(json.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpload = () => {
    if (!pendingFile) return;

    startSave(async () => {
      let uploadedUrl: string | null = null;

      try {
        // 1. Upload new CV to MinIO
        const url = await uploadImageFile(pendingFile, "cv");
        uploadedUrl = url;

        // 2. Delete old CV from MinIO if exists
        if (cv?.fileUrl) {
          await deleteImageByUrl(cv.fileUrl);
        }

        // 3. Save to database (create or update)
        const method = cv ? "PUT" : "POST";
        const response = await fetch("/api/cv", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: pendingFile.name,
            fileUrl: url,
            fileSize: pendingFile.size,
          }),
        });

        if (!response.ok) {
          throw new Error("Gagal menyimpan data CV.");
        }

        const result = await response.json();
        setCv(result.data);

        // Also update SiteContent.cvFileUrl for landing page compatibility
        await fetch("/api/site-content/banner", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entries: [{ key: "cvFileUrl", locale: "", value: url }] }),
        });

        setPendingFile(null);
        toast.success("CV berhasil diupload!");
      } catch (err) {
        // Rollback: delete uploaded file if save fails
        if (uploadedUrl) {
          await deleteImageByUrl(uploadedUrl);
        }
        toast.error(err instanceof Error ? err.message : "Gagal upload CV.");
      }
    });
  };

  const handleDelete = () => {
    if (!cv) return;

    startSave(async () => {
      try {
        // 1. Delete from database
        const response = await fetch("/api/cv", { method: "DELETE" });
        if (!response.ok) throw new Error("Gagal hapus CV.");

        // 2. Delete from MinIO
        await deleteImageByUrl(cv.fileUrl);

        // 3. Clear SiteContent.cvFileUrl
        await fetch("/api/site-content/banner", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entries: [{ key: "cvFileUrl", locale: "", value: "" }] }),
        });

        setCv(null);
        toast.success("CV berhasil dihapus!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal hapus CV.");
      }
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
          <p className="text-sm text-black dark:text-white">Memuat data CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">CV Manager</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">Upload dan kelola file CV (PDF). CV akan ditampilkan di tombol &quot;Download CV&quot; di landing page.</p>
        </div>
      </div>

      {/* Current CV */}
      {cv && (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e] p-5">
          <div className="flex items-center gap-2 text-black dark:text-white font-semibold text-sm mb-4">
            <FileUp className="h-4 w-4 text-emerald-500" />
            CV Aktif
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <FileUp className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-black dark:text-white truncate">{cv.fileName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {cv.fileSize && <span className="text-xs text-black/50 dark:text-white/50">{formatFileSize(cv.fileSize)}</span>}
                <span className="text-xs text-black/30 dark:text-white/30">•</span>
                <span className="text-xs text-black/50 dark:text-white/50 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(cv.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={cv.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Lihat
              </a>
              <Button type="button" variant="ghost" size="sm" onClick={handleDelete} disabled={isSaving} className="text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10">
                <Trash2 className="h-3.5 w-3.5" />
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload area */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a1f2e] p-5">
        <div className="flex items-center gap-2 text-black dark:text-white font-semibold text-sm mb-4">
          <FileUp className="h-4 w-4 text-amber-500" />
          {cv ? "Ganti CV" : "Upload CV"}
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-black dark:text-white/80">File PDF</Label>
            <ImageUploader folder="cv" currentUrl="" onUrlChange={() => {}} onPendingFile={setPendingFile} accept="application/pdf" maxSizeMB={10} label="Drag & drop atau klik untuk memilih file PDF (maks 10MB)" />
          </div>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!pendingFile || isSaving}
            className={cn(
              "rounded-xl font-bold",
              pendingFile ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90" : "bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/40 cursor-not-allowed",
            )}
          >
            {isSaving ? "Menyimpan..." : cv ? "Upload & Ganti CV" : "Upload CV"}
          </Button>
        </div>
      </div>
    </div>
  );
}
