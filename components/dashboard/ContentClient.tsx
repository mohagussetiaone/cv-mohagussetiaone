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
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/dashboard`}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
            </div>
            <h1 className="mt-3 text-xl font-semibold text-white">Content Management</h1>
            <p className="mt-1 text-sm text-white/40">
              Kelola semua konten landing page di sini. Setiap perubahan akan langsung tampil di halaman utama.
            </p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15">
            <FileText className="h-5 w-5 text-brand-400" />
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <SiteContentManager locale={locale} />
    </main>
  );
}
