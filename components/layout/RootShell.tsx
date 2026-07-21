"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/views/Navbar";
import Footer from "@/app/views/Footer";

type RootShellProps = {
  children: React.ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.includes("/dashboard");
  const isSignInRoute = pathname.includes("/signin");

  if (isDashboardRoute || isSignInRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full bg-dark text-white">
      <div className="mx-auto flex min-h-screen w-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(18,247,214,0.16),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.14),transparent_20%),linear-gradient(135deg,#292F36_0%,#1F2937_45%,#111827_100%)]">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
