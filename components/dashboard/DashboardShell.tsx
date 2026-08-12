"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SiteHeader } from "./SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

type DashboardShellProps = {
  children: ReactNode;
  locale: string;
  userEmail: string;
  userName?: string;
};

export function DashboardShell({ children, locale, userEmail, userName }: DashboardShellProps) {
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.dataset.dashboardActive = "true";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      delete document.body.dataset.dashboardActive;
    };
  }, []);

  return (
    <ThemeProvider forcedTheme="default">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
            "--header-height": "3.5rem",
          } as CSSProperties
        }
        data-dashboard-root
        className="fixed inset-0 z-0 h-svh w-full overflow-hidden overscroll-none"
      >
        <AppSidebar locale={locale} userEmail={userEmail} userName={userName} />
        <SidebarInset className="h-svh overflow-hidden overscroll-none">
          <SiteHeader locale={locale} userEmail={userEmail} />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div data-dashboard-scroll-area className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
                <div className="mx-auto w-full max-w-400 px-4 py-6 md:px-8 lg:px-10">{children}</div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
