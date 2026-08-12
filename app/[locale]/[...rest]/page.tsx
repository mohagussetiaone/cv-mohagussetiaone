// Catch-all: semua path yang tidak dikenal di dalam sebuah locale (mis. /en/enk)
// jatuh ke sini, lalu memanggil notFound() supaya Next.js me-render
// app/[locale]/not-found.tsx.
//
// Tanpa route ini, Next.js hanya memakai not-found.tsx jika notFound() dipanggil
// dari dalam sebuah route — untuk path yang tidak match sama sekali, Next.js
// menampilkan 404 bawaannya ("This page could not be found.").
// Ref: https://next-intl.dev/docs/environments/error-files
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Catatan: tidak ada generateStaticParams di sini. Route ini selalu me-render
// 404 dan setiap URL yang tidak dikenal unik, jadi cukup di-generate
// on-demand. (Params tanpa segmen catch-all `[...rest]` juga tidak valid.)
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
