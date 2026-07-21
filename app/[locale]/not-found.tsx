import Link from "next/link";
import { ArrowLeft, Home, Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center overflow-hidden bg-dark px-4">
      {/* Animated Gradient Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-brand-500/5 blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Large 404 */}
        <div className="relative">
          <h1 className="select-none text-[12rem] font-bold leading-none tracking-tighter text-white/5 md:text-[18rem]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <div className="relative inline-block">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">
                  Page Not Found
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Oops! Halaman ini menghilang
              </h2>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-base text-white/50 md:text-lg">
          Sepertinya halaman yang kamu cari tidak ada, sudah dipindah, atau
          mungkin belum pernah dibuat. Tenang, masih banyak yang bisa dilihat.
        </p>

        {/* Divider */}
        <div className="mx-auto mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/10" />
          <Frown className="h-5 w-5 text-white/30" />
          <div className="h-px w-12 bg-white/10" />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25"
          >
            <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Halaman Sebelumnya
          </button>
        </div>
      </div>

      {/* Decorative bottom gradient line */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
    </div>
  );
}
