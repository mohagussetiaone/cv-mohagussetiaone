"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import Navbar from "@/app/views/Navbar";
import Footer from "@/app/views/Footer";

type RootShellProps = {
  children: React.ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDashboardRoute = pathname.includes("/dashboard");
  const isSignInRoute = pathname.includes("/signin");
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  if (isSignInRoute) {
    return <>{children}</>;
  }

  if (isDashboardRoute) {
    return (
      <>
        {children}
        <ThemeSwitcher />
      </>
    );
  }

  return (
    <div className={`min-h-screen w-full ${isNeo ? "bg-white text-black" : isRetro ? "bg-[#f5f0e8] text-black" : "bg-dark text-white"}`}>
      <div
        className={`mx-auto flex min-h-screen w-full flex-col ${
          isNeo
            ? ""
            : isRetro
            ? ""
            : "bg-[radial-gradient(circle_at_top_left,rgba(18,247,214,0.16),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.14),transparent_20%),linear-gradient(135deg,#292F36_0%,#1F2937_45%,#111827_100%)"
        }`}
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
      <ThemeSwitcher />
    </div>
  );
}
