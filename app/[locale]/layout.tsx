import type { Metadata } from "next";
import { Toaster } from "sonner";
import { setRequestLocale } from "next-intl/server";
import "./globals.css";
import { RootShell } from "@/components/layout/RootShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { getSiteUrl, SITE_DESCRIPTION, SITE_LOGO_URL, SITE_OG_IMAGE } from "@/lib/site-url";

export const metadata: Metadata = {
  // Base URL untuk resolve URL relatif di metadata (canonical, OG, dll).
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Moh Agus Setiawan | Frontend React Developer",
    template: "%s | Moh Agus Setiawan",
  },
  // Description via metadata API (bukan hardcoded di <head>) supaya tidak
  // dobel dengan tag yang di-render otomatis oleh Next.js.
  description: SITE_DESCRIPTION,
  // Preview saat link dishare di WhatsApp/Telegram/media sosial:
  // tampilkan logo sebagai gambar kartu.
  openGraph: {
    type: "website",
    siteName: "Moh Agus Setiawan",
    title: "Moh Agus Setiawan | Frontend React Developer",
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moh Agus Setiawan | Frontend React Developer",
    description: SITE_DESCRIPTION,
    images: [SITE_LOGO_URL],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // Wajib untuk static generation (generateStaticParams): memberi tahu next-intl
  // locale mana yang sedang di-render supaya useTranslations/useLocale berfungsi.
  setRequestLocale(locale);
  const { default: enMessages } = await import("../../messages/en.json");
  const { default: idMessages } = await import("../../messages/id.json");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="rfHxt49m6Pm8OYRF_sbphjX7fCLLlfY_RibGFeNQuzs" />
        <link rel="preconnect" href="https://cdn.mohagussetiaone.my.id" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
        <meta name="keywords" content="Moh Agus Setiawan, Frontend Developer, React Developer, Remala Abadi, Next.js, Tailwind CSS, pengembangan web, portofolio, aplikasi web" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <LocaleProvider initialLocale={locale} enMessages={enMessages} idMessages={idMessages}>
          <ThemeProvider>
            <RootShell>{children}</RootShell>
          </ThemeProvider>
          <Toaster position="top-right" expand={false} richColors />
        </LocaleProvider>
      </body>
    </html>
  );
}