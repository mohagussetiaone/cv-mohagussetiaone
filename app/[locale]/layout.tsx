import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import { RootShell } from "@/components/layout/RootShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

export const metadata: Metadata = {
  title: "Moh Agus Setiawan | Frontend React Developer",
  description: "Frontend Web Developer",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const { default: enMessages } = await import("../../messages/en.json");
  const { default: idMessages } = await import("../../messages/id.json");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="rfHxt49m6Pm8OYRF_sbphjX7fCLLlfY_RibGFeNQuzs" />
        <link rel="preconnect" href="https://cdn.mohagussetiaone.my.id" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
        <meta
          name="description"
          content="Moh Agus Setiaone adalah Frontend Developer berpengalaman yang mahir dalam React.js dan bekerja di Remala Abadi. Spesialisasi dalam membangun aplikasi web interaktif dan performa tinggi menggunakan teknologi modern seperti Next.js, Tailwind CSS, dan React. Jelajahi portofolio untuk melihat proyek dan pengalaman terkini."
        />
        <meta name="keywords" content="Moh Agus Setiawan, Frontend Developer, React Developer, Remala Abadi, Next.js, Tailwind CSS, pengembangan web, portofolio, aplikasi web" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Script
          id="bis-skin-checked-remover"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var els = document.querySelectorAll("[bis_skin_checked]");
                  for (var i = 0; i < els.length; i++) {
                    els[i].removeAttribute("bis_skin_checked");
                  }
                } catch(e){}
              })();
            `,
          }}
        />
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