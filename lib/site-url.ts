// Base URL situs — dipakai untuk canonical & hreflang di metadata halaman
// dan sitemap. SITE_URL diekspor eksplisit di deploy.yml; NEXTAUTH_URL dipakai
// sebagai fallback (berisi URL produksi di server).
export function getSiteUrl(): string {
  return (
    process.env.SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "https://mohagussetiaone.my.id"
  ).replace(/\/+$/, "");
}

// Logo situs (dipakai sebagai og:image / twitter:image supaya preview share
// di WhatsApp/Telegram/media sosial menampilkan logo). Dimensi asli: 778x753.
export const SITE_LOGO_URL =
  "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/image/logo/mohagus.jpg";

// Objek og:image logo — dipakai di layout & homepage supaya dimensi
// (778x753) tidak ditulis dobel di dua tempat.
export const SITE_OG_IMAGE = {
  url: SITE_LOGO_URL,
  width: 778,
  height: 753,
  alt: "Logo Moh Agus Setiawan",
};

// Deskripsi default situs (metadata.description + og:description).
export const SITE_DESCRIPTION =
  "Moh Agus Setiaone adalah Frontend Developer berpengalaman yang mahir dalam React.js dan bekerja di Remala Abadi. Spesialisasi dalam membangun aplikasi web interaktif dan performa tinggi menggunakan teknologi modern seperti Next.js, Tailwind CSS, dan React. Jelajahi portofolio untuk melihat proyek dan pengalaman terkini.";
