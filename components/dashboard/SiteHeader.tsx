"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type SiteHeaderProps = {
  locale: string;
  userEmail: string;
};

export function SiteHeader({ locale, userEmail }: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-white/70 hover:text-white" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 bg-white/10" />
        <h1 className="text-base font-medium text-white">Dashboard</h1>

        <div className="ml-auto flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-left shadow-sm transition-colors hover:bg-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-black font-bold text-sm">A</div>
                <div className="hidden min-w-0 sm:grid">
                  <span className="truncate text-sm font-medium text-white">Admin</span>
                  <span className="truncate text-xs text-white/50">{userEmail}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-white/50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 border-white/10 bg-[#12121a] text-white">
              <DropdownMenuLabel className="p-0">
                <div className="px-2 py-1.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white">Admin Workspace</div>
                    <div className="truncate text-xs text-white/50">{userEmail}</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/5">
                <Link href={`/${locale}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Landing Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-rose-400 focus:text-rose-400 focus:bg-rose-500/10" onClick={() => signOut({ callbackUrl: `/${locale}/signin` })}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
