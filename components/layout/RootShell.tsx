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
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen w-full ${isNeo ? "bg-white text-black" : isRetro ? "bg-[#f5f0e8] text-black" : "bg-dark text-white"}`}>
      <div
        className={`mx-auto flex min-h-screen w-full flex-col ${
          isNeo
            ? ""
            : isRetro
            ? ""
            : "bg-[radial-gradient(circle_at_12%_6%,rgba(18,247,214,0.30),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(56,189,248,0.26),transparent_26%),radial-gradient(circle_at_50%_105%,rgba(168,85,247,0.22),transparent_42%),linear-gradient(165deg,#16b8a0_0%,#1F2937_34%,#111827_72%,#05070c_100%)"
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
