import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RootShell } from "@/components/layout/RootShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Moh Agus Setiawan | Frontend React Developer",
  description: "Frontend Web Developer",
};

import { Toaster } from "sonner";

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
        <meta
          name="description"
          content="Moh Agus Setiaone adalah Frontend Developer berpengalaman yang mahir dalam React.js dan bekerja di Remala Abadi. Spesialisasi dalam membangun aplikasi web interaktif dan performa tinggi menggunakan teknologi modern seperti Next.js, Tailwind CSS, dan React. Jelajahi portofolio untuk melihat proyek dan pengalaman terkini."
        />
        <meta name="keywords" content="Moh Agus Setiawan, Frontend Developer, React Developer, Remala Abadi, Next.js, Tailwind CSS, pengembangan web, portofolio, aplikasi web" />
        <meta name="robots" content="index, follow" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === "attributes" && m.attributeName === "bis_skin_checked") {
                        m.target.removeAttribute("bis_skin_checked");
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ["bis_skin_checked"],
                    subtree: true,
                  });
                  var els = document.querySelectorAll("[bis_skin_checked]");
                  for (var i = 0; i < els.length; i++) {
                    els[i].removeAttribute("bis_skin_checked");
                  }
                  setTimeout(function() { observer.disconnect(); }, 3000);
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
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
