// Custom loader untuk next/image: semua gambar aset R2 disajikan lewat route
// same-origin /api/cdn/<key> (lihat lib/cdn-url.ts untuk alasannya), bukan
// lewat hostname CDN dan bukan lewat optimizer /_next/image.
//
// Dengan loader kustom, next/image memakai URL hasil loader apa adanya
// sebagai src/srcSet — optimizer tidak lagi fetch gambar asal dari dalam
// Worker (itulah yang 403 di domain custom). Gambar yang bukan aset R2
// (host eksternal, blob:, path lokal) dilewatkan tanpa diubah.
import { toLocalCdnUrl } from "./cdn-url";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src }: ImageLoaderProps): string {
  return toLocalCdnUrl(src);
}
