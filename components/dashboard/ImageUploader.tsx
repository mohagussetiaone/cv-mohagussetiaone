"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ImageUp, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  // Cleanup local preview URL on unmount
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const processFile = useCallback(
    (file: File) => {
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

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      processFile(file);
    },
    [processFile],
  );

  // ─── Drag & Drop handlers ────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      processFile(file);
    },
    [processFile],
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
      {/* ─── Drop Zone ─── */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !hasPending && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200",
          "cursor-pointer select-none",
          isDragging ? "border-amber-400 bg-amber-400/10 scale-[1.01]" : "border-black/15 dark:border-white/15 hover:border-amber-400/50 hover:bg-amber-400/5",
          hasPending && "pointer-events-none border-amber-400/50 bg-amber-400/5",
        )}
      >
        {/* Icon */}
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-colors", isDragging ? "bg-amber-400/20 text-amber-500" : "bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30")}>
          <ImageUp className="h-6 w-6" />
        </div>

        {/* Text */}
        {isDragging ? (
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Lepaskan file di sini</p>
        ) : hasPending ? (
          <>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">File dipilih</p>
            <p className="max-w-full truncate text-xs font-mono text-black/60 dark:text-white/60">{pendingFile?.name}</p>
          </>
        ) : (
          <>
            <p className="text-sm text-black/60 dark:text-white/60">
              <span className="font-medium text-amber-600 dark:text-amber-400">Klik untuk memilih</span> atau seret file ke sini
            </p>
            <p className="text-xs text-black/40 dark:text-white/40">JPG, PNG, WEBP, atau SVG — maks {maxSizeMB}MB</p>
          </>
        )}

        {/* Remove button when pending */}
        {hasPending && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="mt-1 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <X className="h-3 w-3" />
            Hapus
          </button>
        )}

        {/* Saved state */}
        {hasSaved && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="mt-1 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <X className="h-3 w-3" />
            Ganti file
          </button>
        )}

        {/* Glow effect when dragging */}
        {isDragging && <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-amber-400/40 ring-offset-2 ring-offset-transparent" />}
      </div>

      <input ref={inputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />
      {sizeError && <p className="text-xs text-rose-400/80">{sizeError}</p>}

      {/* Preview thumbnail */}
      {previewSrc && hasSaved && (
        <div className="relative flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121826] p-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/5">
            <Image src={previewSrc} alt="Preview" fill className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            <a href={currentUrl} target="_blank" rel="noopener noreferrer" title={currentUrl} className="block truncate text-xs font-mono text-black dark:text-white underline decoration-dotted underline-offset-2 hover:text-emerald-600">
              {currentUrl}
            </a>
            <p className="text-xs text-emerald-600">Tersimpan di MinIO via CDN — klik URL untuk membuka di tab baru</p>
          </div>
        </div>
      )}

      <p className="text-xs text-black dark:text-white/60">{label}</p>
    </div>
  );
}
