"use server";

import { randomUUID } from "crypto";
import { buildMinioObjectName, buildMinioPublicUrl, deleteMinioObject, ensureMinioBucket, getMinioBucketName, getMinioClient } from "@/lib/minio";

export type UploadResult = {
  url: string;
  objectName: string;
};

/**
 * Upload a File (from FormData) to MinIO and return CDN URL.
 * Called server-side during save flow.
 */
export async function uploadFileToMinio(file: File, folder: string = "general"): Promise<UploadResult> {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase() ||
    file.type.split("/")[1] ||
    "bin";
  const objectName = buildMinioObjectName(`${randomUUID()}.${extension}`, folder);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const client = getMinioClient();

  await ensureMinioBucket(client);
  await client.putObject(getMinioBucketName(), objectName, buffer, buffer.length, {
    "Content-Type": file.type,
    "Cache-Control": "public, max-age=31536000, immutable",
  });

  return {
    url: buildMinioPublicUrl(objectName),
    objectName,
  };
}

/**
 * Delete an old file from MinIO by its public URL (if it exists).
 * Safe to call even if url is empty or null.
 */
export async function deleteOldFile(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    await deleteMinioObject(url);
  } catch {
    // Silently ignore — old file might not exist or be from a different source
  }
}
