"use server";

import { buildR2ObjectName, buildR2PublicUrl, deleteR2Object, putR2Object } from "@/lib/r2";

export type UploadResult = {
  url: string;
  objectName: string;
};

/**
 * Upload a File (from FormData) to R2 and return CDN URL.
 * Called server-side during save flow.
 * (Dulu uploadFileToMinio — diganti ke R2 saat porting ke Cloudflare.)
 */
export async function uploadFileToR2(file: File, folder: string = "general"): Promise<UploadResult> {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase() ||
    file.type.split("/")[1] ||
    "bin";
  const objectName = buildR2ObjectName(`${globalThis.crypto.randomUUID()}.${extension}`, folder);
  const arrayBuffer = await file.arrayBuffer();
  await putR2Object(objectName, new Uint8Array(arrayBuffer), file.type);

  return {
    url: buildR2PublicUrl(objectName),
    objectName,
  };
}

/**
 * Delete an old file from R2 by its public URL (if it exists).
 * Safe to call even if url is empty or null.
 */
export async function deleteOldFile(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    await deleteR2Object(url);
  } catch {
    // Silently ignore — old file might not exist or be from a different source
  }
}
