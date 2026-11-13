import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Pengganti lib/minio.ts: upload ke R2 (S3-compatible) via @aws-sdk/client-s3.
// Bekerja di runtime Workers (tanpa Node API) — tidak ada lagi SDK MinIO,
// Buffer, atau `crypto` Node di jalur ini.
//
// Konfigurasi dibaca dari env Cloudflare (wrangler [vars] + secrets) saat
// berjalan di Worker, fallback ke process.env saat `next dev` lokal:
//   R2_ACCOUNT_ID        (atau R2_ENDPOINT lengkap)
//   R2_ACCESS_KEY_ID     (secret — R2 API token)
//   R2_SECRET_ACCESS_KEY (secret — R2 API token)
//   R2_BUCKET            (default "mycv-assets", sudah di [vars])
//   R2_PUBLIC_BASE_URL   (default https://cdn.mohagussetiaone.my.id)
//   R2_PUBLIC_PATH_PREFIX (default "mohagussetiaone" — lihat wrangler.toml)
// Binding R2 `mycv_assets` dideklarasikan di wrangler.toml (jalur native
// Workers, tersedia untuk pemakaian berikutnya); jalur aktif saat ini adalah
// S3 client di atas supaya perilaku upload identik di Workers dan lokal.

type R2Env = {
  R2_ACCOUNT_ID?: string;
  R2_ENDPOINT?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET?: string;
  R2_PUBLIC_BASE_URL?: string;
  R2_PUBLIC_PATH_PREFIX?: string;
  R2_PROJECT_IMAGE_FOLDER?: string;
};

const normalizePath = (value: string) => value.replace(/^\/+|\/+$/g, "");

function readEnv(): R2Env {
  try {
    const { env } = getCloudflareContext();
    return env as unknown as R2Env;
  } catch {
    // Di luar Worker (mis. `next dev` tanpa initOpenNextCloudflareForDev):
    // pakai process.env (.env.local).
    return process.env as unknown as R2Env;
  }
}

export function hasR2Config() {
  const env = readEnv();
  return Boolean(
    env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      (env.R2_ACCOUNT_ID || env.R2_ENDPOINT) &&
      getR2BucketName(),
  );
}

export function getR2BucketName() {
  return readEnv().R2_BUCKET?.trim() || "mycv-assets";
}

export function getR2PublicBaseUrl() {
  return readEnv().R2_PUBLIC_BASE_URL?.trim().replace(/\/+$/g, "") || "https://cdn.mohagussetiaone.my.id";
}

export function getR2PublicPathPrefix() {
  return normalizePath(readEnv().R2_PUBLIC_PATH_PREFIX?.trim() || "mohagussetiaone");
}

function getS3Client() {
  const env = readEnv();
  const endpoint =
    env.R2_ENDPOINT?.trim() ||
    (env.R2_ACCOUNT_ID ? `https://${env.R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com` : undefined);

  if (!endpoint || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    throw new Error(
      "Konfigurasi R2 belum lengkap (R2_ACCOUNT_ID/R2_ENDPOINT + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY).",
    );
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export function buildR2ObjectName(fileName: string, folder?: string) {
  const subfolder = folder ? normalizePath(folder) : normalizePath(readEnv().R2_PROJECT_IMAGE_FOLDER || "projects");
  const cleanedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${subfolder}/${Date.now()}-${cleanedName}`;
}

export function buildR2PublicUrl(objectName: string) {
  // Bentuk URL dipertahankan persis seperti era MinIO supaya URL di DB produksi
  // tetap valid: base/prefix/object. Prefix BUKAN nama bucket R2 (bucket R2
  // adalah "mycv-assets"); prefix dilepas oleh Worker routing saat serve.
  const prefix = getR2PublicPathPrefix();
  return `${getR2PublicBaseUrl()}/${prefix}/${normalizePath(objectName)}`;
}

/**
 * Extract the object name (path) from an R2 public URL.
 * Example: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/projects/123-uuid.jpg"
 *   -> returns "projects/123-uuid.jpg"
 */
export function extractObjectNameFromUrl(publicUrl: string): string | null {
  const baseUrl = getR2PublicBaseUrl();
  if (!publicUrl.startsWith(baseUrl)) return null;

  let rest = normalizePath(publicUrl.slice(baseUrl.length));

  // Lepas prefix path publik jika ada (format: base/prefix/object)
  const prefix = getR2PublicPathPrefix();
  if (prefix && rest.startsWith(`${prefix}/`)) {
    rest = rest.slice(prefix.length + 1);
  }

  return rest;
}

/** Upload satu objek ke R2. Bucket "mycv-assets" sudah dibuat user — tidak dibuat otomatis di sini. */
export async function putR2Object(objectName: string, body: Uint8Array, contentType: string): Promise<void> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: objectName,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

/** Delete an object from R2 by its public URL. */
export async function deleteR2Object(publicUrl: string): Promise<void> {
  const objectName = extractObjectNameFromUrl(publicUrl);
  if (!objectName) return;

  const client = getS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: getR2BucketName(), Key: objectName }));
}
