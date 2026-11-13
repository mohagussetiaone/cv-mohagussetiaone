import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { R2Bucket } from "@cloudflare/workers-types";
import { NextResponse } from "next/server";

// GET /api/cdn/<key> — sajikan satu objek dari bucket R2 `mycv-assets`
// langsung lewat binding, tanpa HTTP subrequest ke hostname CDN.
//
// Ini pengganti Worker CDN terpisah (mycv-cdn) untuk kebutuhan situs mycv:
// next/image tidak lagi bisa mengambil gambar asal dari hostname CDN karena
// fetch() dari dalam Worker mycv ke hostname itu langsung mengenai origin
// VPS (MinIO, bucket sudah dihapus) dan optimizer membalas 403 — lihat
// lib/cdn-url.ts. Membaca binding di sini menghilangkan seluruh rantai itu:
// request masuk ke Worker mycv (satu origin dengan situs), Worker membaca
// R2, selesai. Tidak ada DNS, tidak ada route Worker lain, tidak ada origin.
//
// Key = path objek di bucket, mis. assets/image/logo/mohagus.jpg atau
// projects/1789529791253-....png atau cv/1789542127476-....pdf.
// Respons di-cache lama (key upload memakai nama ber-timestamp, aman immutable).
// Objek yang tidak ada -> 404; key traversal -> 400.

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
  ico: "image/x-icon",
  pdf: "application/pdf",
};

function guessContentType(key: string): string | undefined {
  const ext = key.split(".").pop()?.toLowerCase();
  return ext ? MIME_BY_EXT[ext] : undefined;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: segments } = await params;
  const key = segments.join("/");

  if (!key || key.startsWith("/") || segments.some((s) => s === "" || s === "..")) {
    return new NextResponse("Bad key", { status: 400 });
  }

  let bucket: R2Bucket | undefined;
  try {
    const { env } = getCloudflareContext();
    bucket = (env as { mycv_assets?: R2Bucket }).mycv_assets;
  } catch {
    bucket = undefined;
  }
  if (!bucket) {
    return new NextResponse("R2 binding unavailable", { status: 500 });
  }

  const object = await bucket.get(key);
  if (!object) {
    return new NextResponse("Not found", { status: 404 });
  }

  const headers = new Headers();
  const contentType = object.httpMetadata?.contentType || guessContentType(key);
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  if (object.etag) headers.set("ETag", object.etag);
  if (object.size != null) headers.set("Content-Length", String(object.size));

  // Body R2 (tipe Workers) bukan BodyInit DOM — cast via unknown.
  return new Response(object.body as unknown as ReadableStream, { headers });
}
