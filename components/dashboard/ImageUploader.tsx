"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ImageUp, X, FileWarning } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  folder?: string;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  onPendingFile?: (file: File | null) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
};

/**
 * Komponen upload gambar dengan pola DEFERRED:
 * file hanya dipilih & di-preview di sini, kemudian diupload otomatis
 * saat form di-submit (oleh komponen induk). Tidak ada tombol upload manual.
 */
export function ImageUploader({ folder = "general", currentUrl, onUrlChange, onPendingFile, label = "Upload image ke MinIO", accept = "image/png,image/jpeg,image/webp,image/svg+xml", maxSizeMB = 5 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

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
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="relative border border-black/10 bg-white text-black hover:bg-black/5">
          {hasPending ? <FileWarning className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> : <ImageUp className="mr-1.5 h-3.5 w-3.5" />}
          {hasPending ? "Ganti file" : "Pilih file"}
        </Button>

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
        <div className="relative mt-1 flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/5">
            <Image src={previewSrc} alt="Preview" fill className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            {hasPending ? (
              <>
                <p className="text-xs font-medium text-amber-600">Menunggu upload</p>
                <p className="truncate text-xs font-mono text-black">{pendingFile?.name}</p>
                <p className="text-xs text-amber-600/80">File akan diupload otomatis saat submit form</p>
              </>
            ) : hasSaved ? (
              <>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" title={currentUrl} className="block truncate text-xs font-mono text-black underline decoration-dotted underline-offset-2 hover:text-emerald-600">
                  {currentUrl}
                </a>
                <p className="text-xs text-emerald-600">Tersimpan di MinIO via CDN — klik URL untuk membuka di tab baru</p>
              </>
            ) : null}
          </div>
        </div>
      )}

      <p className="text-xs text-black">{label}</p>
    </div>
  );
}
