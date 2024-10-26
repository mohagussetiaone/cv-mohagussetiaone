import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "../views/Navbar";
import Footer from "../views/Footer";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const message = await getMessages();

  return (
    <html lang="id">
      <head>
        <meta name="google-site-verification" content="rfHxt49m6Pm8OYRF_sbphjX7fCLLlfY_RibGFeNQuzs" />
        <meta
          name="description"
          content="Moh Agus Setiaone adalah Frontend Developer berpengalaman yang mahir dalam React.js dan bekerja di Remala Abadi. Spesialisasi dalam membangun aplikasi web interaktif dan performa tinggi menggunakan teknologi modern seperti Next.js, Tailwind CSS, dan React. Jelajahi portofolio untuk melihat proyek dan pengalaman terkini."
        />
        <meta name="keywords" content="Moh Agus Setiawan, Frontend Developer, React Developer, Remala Abadi, Next.js, Tailwind CSS, pengembangan web, portofolio, aplikasi web" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-6xl mx-auto`}>
        <NextIntlClientProvider messages={message}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
