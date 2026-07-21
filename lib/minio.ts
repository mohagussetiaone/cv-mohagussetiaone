import { Client } from "minio";

const requiredEnvKeys = [
  "MINIO_ENDPOINT",
  "MINIO_USE_SSL",
  "MINIO_ACCESS_KEY",
  "MINIO_SECRET_KEY",
  "MINIO_BUCKET",
] as const;

const normalizePath = (value: string) => value.replace(/^\/+|\/+$/g, "");

const parseBoolean = (value: string | undefined) => value === "true";
const parsePort = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const port = Number.parseInt(value, 10);
  return Number.isNaN(port) ? undefined : port;
};

export function hasMinioConfig() {
  return requiredEnvKeys.every((key) => {
    const value = process.env[key];
    return typeof value === "string" && value.length > 0;
  });
}

export function getMinioBucketName() {
  return process.env.MINIO_BUCKET ?? "";
}

export function getMinioPublicBaseUrl() {
  const explicitUrl =
    process.env.MINIO_PUBLIC_BASE_URL?.trim() || process.env.MINIO_PUBLIC_URL?.trim();

  if (explicitUrl) {
    return explicitUrl.replace(/\/+$/g, "");
  }

  const endpoint = process.env.MINIO_ENDPOINT?.trim();
  const port = process.env.MINIO_PORT?.trim();
  const useSsl = parseBoolean(process.env.MINIO_USE_SSL);

  if (!endpoint) {
    return null;
  }

  const protocol = useSsl ? "https" : "http";
  return port ? `${protocol}://${endpoint}:${port}` : `${protocol}://${endpoint}`;
}

export function getMinioClient() {
  if (!hasMinioConfig()) {
    throw new Error("Konfigurasi MinIO belum lengkap.");
  }

  return new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parsePort(process.env.MINIO_PORT),
    useSSL: parseBoolean(process.env.MINIO_USE_SSL),
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  });
}

export async function ensureMinioBucket(client: Client) {
  if (parseBoolean(process.env.MINIO_AUTO_CREATE_BUCKET) === false) {
    return;
  }

  const bucket = getMinioBucketName();
  const exists = await client.bucketExists(bucket);

  if (!exists) {
    await client.makeBucket(
      bucket,
      process.env.MINIO_REGION || process.env.MINIO_BUCKET_REGION || "us-east-1"
    );
  }
}

export function buildMinioObjectName(fileName: string) {
  const folder = normalizePath(process.env.MINIO_PROJECT_IMAGE_FOLDER || "projects");
  const cleanedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${folder}/${Date.now()}-${cleanedName}`;
}

export function buildMinioPublicUrl(objectName: string) {
  const baseUrl = getMinioPublicBaseUrl();

  if (!baseUrl) {
    throw new Error("MINIO_PUBLIC_BASE_URL atau MINIO_PUBLIC_URL belum diatur.");
  }

  if (process.env.MINIO_PUBLIC_BASE_URL?.trim()) {
    return `${baseUrl}/${normalizePath(objectName)}`;
  }

  const bucket = normalizePath(getMinioBucketName());
  return `${baseUrl}/${bucket}/${normalizePath(objectName)}`;
}
