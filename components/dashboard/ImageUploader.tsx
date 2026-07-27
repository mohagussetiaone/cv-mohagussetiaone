"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ImageUp, X, FileWarning, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ImageUploaderProps = {
  folder?: string;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  onPendingFile?: (file: File | null) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
};

export function ImageUploader({ folder = "general", currentUrl, onUrlChange, onPendingFile, label = "Upload image ke MinIO", accept = "image/png,image/jpeg,image/webp,image/svg+xml", maxSizeMB = 5 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup local preview URL on unmount
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setSizeError(null);

      if (file.size > maxSizeMB * 1024 * 1024) {
        setSizeError(`Ukuran file maksimal ${maxSizeMB}MB.`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      // Revoke old preview
      if (localPreview && localPreview.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }

      // Show local preview
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      setPendingFile(file);
      onPendingFile?.(file);
    },
    [maxSizeMB, localPreview, onPendingFile],
  );

  const handleUploadNow = useCallback(async () => {
    if (!pendingFile) return;
    setIsUploading(true);

    try {
      const payload = new FormData();
      payload.append("file", pendingFile);
      payload.append("folder", folder);

      const response = await fetch("/api/uploads/general", { method: "POST", body: payload });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.message || "Gagal upload.");
        return;
      }

      const url = result?.data?.url ?? "";

      // Hapus file lama dari MinIO
      if (currentUrl) {
        try {
          await fetch("/api/uploads/general", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: currentUrl }),
          });
        } catch {
          /* ignore */
        }
      }

      // Revoke blob preview, set CDN URL
      if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
      setPendingFile(null);
      onPendingFile?.(null);
      onUrlChange(url);

      toast.success("File berhasil diupload ke MinIO/CDN!");
    } catch {
      toast.error("Gagal upload file.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [pendingFile, folder, currentUrl, localPreview, onPendingFile, onUrlChange]);

  const handleRemove = useCallback(() => {
    if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setPendingFile(null);
    setSizeError(null);
    onPendingFile?.(null);
    onUrlChange("");
    if (inputRef.current) inputRef.current.value = "";
  }, [localPreview, onPendingFile, onUrlChange]);

  const hasPending = pendingFile !== null;
  const hasSaved = !!currentUrl && !hasPending;
  const previewSrc = localPreview || currentUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={isUploading} className="relative border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">
          {hasPending ? <FileWarning className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> : <ImageUp className="mr-1.5 h-3.5 w-3.5" />}
          {hasPending ? "Ganti file" : "Pilih file"}
        </Button>

        {hasPending && (
          <Button type="button" size="sm" disabled={isUploading} onClick={handleUploadNow} className="bg-brand-500 text-black hover:bg-brand-400">
            {isUploading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-1 h-3.5 w-3.5" />}
            {isUploading ? "Uploading..." : "Upload now"}
          </Button>
        )}

        {hasSaved && (
          <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10">
            <X className="mr-1 h-3.5 w-3.5" />
            Hapus
          </Button>
        )}
      </div>

      <input ref={inputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

      {sizeError && <p className="text-xs text-rose-400/80">{sizeError}</p>}

      {previewSrc && (
        <div className="relative mt-1 flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/20">
            <Image src={previewSrc} alt="Preview" fill className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            {hasPending ? (
              <>
                <p className="text-xs font-medium text-amber-400/90">Menunggu upload</p>
                <p className="truncate text-xs font-mono text-white/40">{pendingFile?.name}</p>
                <p className="text-xs text-amber-400/60">Klik &quot;Upload now&quot; untuk upload ke MinIO</p>
              </>
            ) : hasSaved ? (
              <>
                <p className="truncate text-xs font-mono text-white/60">{currentUrl}</p>
                <p className="text-xs text-emerald-400/80">Tersimpan di MinIO via CDN</p>
              </>
            ) : null}
          </div>
        </div>
      )}

      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}
