"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { SiteContentManager } from "@/components/dashboard/SiteContentManager";

type ContentClientProps = {
  locale: string;
};

export function ContentClient({ locale }: ContentClientProps) {
  return (
    <main className="flex flex-1 flex-col gap-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <h1 className="mt-3 text-xl font-semibold text-black dark:text-white">Content Management</h1>
            <p className="mt-1 text-sm text-black/70 dark:text-white/50">
              Kelola semua konten landing page di sini. Setiap perubahan akan langsung tampil di halaman utama.
            </p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/15 bg-amber-400">
            <FileText className="h-5 w-5 text-black dark:text-white" />
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <SiteContentManager locale={locale} />
    </main>
  );
}
