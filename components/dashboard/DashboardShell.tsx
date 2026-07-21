"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SiteHeader } from "./SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "3.5rem",
        } as CSSProperties
      }
      className="fixed inset-0 z-0 h-svh w-full overflow-hidden overscroll-none"
    >
      <AppSidebar locale={locale} userEmail={userEmail} userName={userName} />
      <SidebarInset className="h-svh overflow-hidden overscroll-none">
        <SiteHeader locale={locale} userEmail={userEmail} />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
              data-dashboard-scroll-area
              className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
            >
              <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 lg:px-10">
                {children}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
