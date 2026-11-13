// Pemetaan URL aset R2 dari hostname CDN publik ke route same-origin.
//
// URL aset yang tersimpan di DB produksi berbentuk URL CDN publik:
//   https://cdn.mohagussetiaone.my.id/mohagussetiaone/<key>
// Dulu URL itu dilayani Worker CDN (mycv-cdn -> R2) dan dioptimasi lewat
// next/image (/_next/image?url=...). Jalur itu RUSAK di domain custom:
//
// next/image mengambil gambar asal dengan fetch() dari DALAM Worker mycv.
// Subrequest dari Worker ke hostname yang record DNS-nya menunjuk origin VPS
// (cdn -> 43.157.224.103) TIDAK melewati route Worker mycv-cdn, melainkan
// langsung ke origin — MinIO yang bucket-nya sudah dihapus saat decommission
// (13 Nov 2026) sehingga menjawab 403 AccessDenied. Optimizer lalu membalas
// 403 '"url" parameter is valid but upstream response is invalid' dan SEMUA
// gambar di situs tidak ter-render di domain custom (apex + www), padahal di
// workers.dev optimizer yang sama berhasil (200) karena di sana subrequest
// melewati edge dan mengenai route mycv-cdn.
//
// Obatnya: jangan lagi mengambil aset lewat hostname CDN dari browser maupun
// dari optimizer. Arahkan semua URL aset R2 ke route same-origin
// /api/cdn/<key> (app/api/cdn/[...key]/route.ts) yang membaca binding R2
// `mycv_assets` LANGSUNG — tanpa HTTP subrequest, tanpa DNS, tanpa route
// Worker lain. Karena route itu satu origin dengan situs (apex, DNS-nya
// sudah segar di mana-mana), gambar ikut tampil begitu situsnya tampil.
//
// Dipakai oleh: lib/image-loader.ts (semua next/image) dan komponen yang
// fetch URL aset langsung (mis. download CV di Banner.tsx). URL di DB TIDAK
// diubah — pemetaan terjadi saat render, jadi data produksi tetap apa adanya.

export const R2_CDN_BASE_URL = "https://cdn.mohagussetiaone.my.id";
export const R2_CDN_PATH_PREFIX = "mohagussetiaone";

/** Ambil object key R2 dari URL CDN publik; null bila URL bukan URL aset R2. */
export function extractR2KeyFromCdnUrl(url: string): string | null {
  const prefix = `${R2_CDN_BASE_URL}/${R2_CDN_PATH_PREFIX}/`;
  if (!url.startsWith(prefix)) return null;
  const key = url.slice(prefix.length);
  if (!key || key.startsWith("/") || key.includes("..")) return null;
  return key;
}

/**
 * Petakan URL aset R2 (CDN publik) ke route same-origin /api/cdn/<key>.
 * URL lain (host eksternal, blob:, data:, path lokal) dikembalikan apa adanya.
 */
export function toLocalCdnUrl(url: string): string {
  const key = extractR2KeyFromCdnUrl(url);
  return key ? `/api/cdn/${key}` : url;
}
