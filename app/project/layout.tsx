import "../[locale]/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moh Agus Setiawan",
  description: "Frontend Web Developer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
