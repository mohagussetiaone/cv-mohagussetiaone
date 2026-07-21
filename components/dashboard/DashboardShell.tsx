"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SiteHeader } from "./SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardShellProps = {
  children: ReactNode;
  locale: string;
  userEmail: string;
};

export function DashboardShell({ children, locale, userEmail }: DashboardShellProps) {
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
          "--sidebar-width": "18rem",
          "--header-height": "3rem",
        } as CSSProperties
      }
      className="fixed inset-0 z-0 h-svh w-full overflow-hidden overscroll-none"
    >
      <AppSidebar locale={locale} variant="inset" />
      <SidebarInset className="h-svh overflow-hidden overscroll-none">
        <SiteHeader locale={locale} userEmail={userEmail} />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[44px_44px]">
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
            <div data-dashboard-scroll-area className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain py-4 md:gap-6 md:py-6 ">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
