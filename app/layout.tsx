import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "./views/Navbar";
import Footer from "./views/Footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Moh Agus Setiawan",
  description: "Frontend Web Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="rfHxt49m6Pm8OYRF_sbphjX7fCLLlfY_RibGFeNQuzs" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-6xl mx-auto`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
