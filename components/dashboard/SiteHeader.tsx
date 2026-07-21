"use client";

import Link from "next/link";
import { ChevronDown, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SiteHeaderProps = {
  locale: string;
  userEmail: string;
};

export function SiteHeader({ locale, userEmail }: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-left shadow-sm transition-colors hover:bg-slate-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="hidden min-w-0 sm:grid">
                  <span className="truncate text-sm font-medium text-slate-900">
                    Admin Workspace
                  </span>
                  <span className="truncate text-xs text-slate-500">
                    {userEmail}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="p-0">
                <div className="px-2 py-1.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      Admin Workspace
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {userEmail}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-slate-700">
                <Link href="/">Landing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-700">
                Profile Workspace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-rose-600 focus:text-rose-600"
                onClick={() => signOut({ callbackUrl: `/${locale}/signin` })}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
