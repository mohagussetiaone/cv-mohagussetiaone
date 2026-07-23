import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { RootShell } from "@/components/layout/RootShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Script from "next/script";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const message = await getMessages();

  return (
    <html lang="id" suppressHydrationWarning>
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
                  // Remove bis_skin_checked attributes added by browser extensions (e.g. Bisheng)
                  // that cause React hydration mismatches. Uses a MutationObserver to
                  // catch the attribute the moment it gets added at any timing.
                  var cleanAttrs = function() {
                    var els = document.querySelectorAll("[bis_skin_checked]");
                    for (var i = 0; i < els.length; i++) {
                      els[i].removeAttribute("bis_skin_checked");
                    }
                  };
                  // Clean any that were already added
                  cleanAttrs();
                  // Watch for new additions by browser extensions
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
                  // Disconnect observer after 3s to avoid permanent perf impact
                  setTimeout(function() { observer.disconnect(); }, 3000);
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("cv-theme");
                  if (theme === "retro" || theme === "neobrutalism" || theme === "default") {
                    document.documentElement.setAttribute("data-theme", theme);
                  } else {
                    document.documentElement.setAttribute("data-theme", "default");
                  }
                } catch(e) {
                  document.documentElement.setAttribute("data-theme", "default");
                }
              })();
            `,
          }}
        />
        <NextIntlClientProvider messages={message}>
          <ThemeProvider>
            <RootShell>{children}</RootShell>
          </ThemeProvider>
          <Toaster position="top-right" expand={false} richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
