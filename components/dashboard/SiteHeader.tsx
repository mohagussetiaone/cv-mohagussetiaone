"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  locale: string;
  userEmail: string;
};

export function SiteHeader({ locale, userEmail }: SiteHeaderProps) {
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";

  return (
    <header className={cn(
      "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear",
      isNeo ? "border-black bg-white/80 backdrop-blur-xl" : "border-black/10 bg-white/80 backdrop-blur-xl"
    )}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-black/60 hover:text-black" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 bg-black/10" />
        <h1 className="text-base font-medium text-black">Dashboard</h1>

        <div className="ml-auto flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-3 rounded-xl px-3 py-1.5 text-left shadow-sm transition-colors",
                isNeo ? "border-2 border-black bg-amber-100 hover:bg-amber-200 shadow-[3px_3px_0px_0px_black]" : "border border-black/10 bg-white hover:bg-black/5"
              )}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black font-bold text-sm border-2 border-black">A</div>
                <div className="hidden min-w-0 sm:grid">
                  <span className="truncate text-sm font-medium text-black">Admin</span>
                  <span className="truncate text-xs text-black">{userEmail}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-black" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn(
              "w-64",
              isNeo ? "border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_black]" : "border border-black/10 bg-white text-black"
            )}>
              <DropdownMenuLabel className="p-0">
                <div className="px-2 py-1.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-black">Admin Workspace</div>
                    <div className="truncate text-xs text-black">{userEmail}</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/10" />
              <DropdownMenuItem asChild className="text-black hover:text-black focus:text-black focus:bg-black/5">
                <Link href={`/${locale}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Landing Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/10" />
              <DropdownMenuItem className="text-rose-500 focus:text-rose-500 focus:bg-rose-500/10" onClick={() => signOut({ callbackUrl: `/${locale}/signin` })}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
