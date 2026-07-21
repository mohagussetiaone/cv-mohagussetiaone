import { redirect } from "next/navigation";
import { LockKeyhole, Sparkles } from "lucide-react";
import { getAuthSession } from "@/auth";
import { isAdminEmail } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { SignInButton } from "@/components/dashboard/SignInButton";

type SignInPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ params, searchParams }: SignInPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const session = await getAuthSession();

  if (session?.user?.email && isAdminEmail(session.user.email)) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <main className="relative isolate min-h-svh w-full overflow-hidden bg-dark text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,247,214,0.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(135deg,#292F36_0%,#111827_45%,#0F172A_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(18,247,214,0.12),transparent_22%)]" />

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center text-white">
            <Badge variant="secondary" className="mb-5 w-fit gap-2 bg-white/10 px-4 py-2 text-white hover:bg-white/10">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              Version 1.1
            </Badge>

            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Dashboard Sign In</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">Satu pintu aman untuk mengelola konten CV dan portfolio.</h1>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-4xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="gap-2 bg-brand-500/15 text-brand-500 hover:bg-brand-500/15">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Google Login
                </Badge>
                <Badge variant="outline" className="border-white/15 text-white/70">
                  Locale: {locale.toUpperCase()}
                </Badge>
              </div>

              <h2 className="mt-6 text-3xl font-semibold text-white">Masuk</h2>

              {resolvedSearchParams.error ? <p className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">Akses ditolak. Pastikan login memakai email admin yang diizinkan.</p> : null}

              <div className="mt-6">
                <SignInButton callbackUrl={`/${locale}/dashboard`} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
