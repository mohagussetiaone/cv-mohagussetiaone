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
  const isDefault = theme === "default";
  const isRetro = theme === "retro";
  const isNeo = theme === "neobrutalism";

  return (
    <header className={cn(
      "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear",
      isDefault ? "border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl" : isRetro ? "border-[#6699ff]/30 bg-[#f5f0e8]/80 backdrop-blur-xl" : "border-[#fbbf24]/50 bg-white/80 backdrop-blur-xl"
    )}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className={cn("-ml-1", isDefault ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-black")} />
        <Separator orientation="vertical" className={cn("mx-2 data-[orientation=vertical]:h-4", isDefault ? "bg-white/10" : isRetro ? "bg-[#6699ff]/30" : "bg-[#fbbf24]/40")} />
        <h1 className={cn("text-base font-medium", isDefault ? "text-white" : "text-black")}>Dashboard</h1>

        <div className="ml-auto flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-3 rounded-xl px-3 py-1.5 text-left shadow-sm transition-colors",
                isDefault ? "border border-white/10 bg-white/5 hover:bg-white/10" : isRetro ? "border border-[#6699ff]/30 bg-[#f5f0e8] hover:bg-[#ede4d4]" : "border-[3px] border-black bg-amber-100 hover:bg-amber-200 shadow-[3px_3px_0px_0px_black]"
              )}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-black font-bold text-sm">A</div>
                <div className="hidden min-w-0 sm:grid">
                  <span className={cn("truncate text-sm font-medium", isDefault ? "text-white" : "text-black")}>Admin</span>
                  <span className={cn("truncate text-xs", isDefault ? "text-white/50" : "text-gray-500")}>{userEmail}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4", isDefault ? "text-white/50" : "text-gray-500")} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn(
              "w-64",
              isDefault ? "border-white/10 bg-[#12121a] text-white" : isRetro ? "border-[#6699ff]/30 bg-[#f5f0e8] text-black" : "border-[3px] border-black bg-white text-black shadow-[4px_4px_0px_0px_black]"
            )}>
              <DropdownMenuLabel className="p-0">
                <div className="px-2 py-1.5">
                  <div className="min-w-0">
                    <div className={cn("truncate text-sm font-medium", isDefault ? "text-white" : "text-black")}>Admin Workspace</div>
                    <div className={cn("truncate text-xs", isDefault ? "text-white/50" : "text-gray-500")}>{userEmail}</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className={isDefault ? "bg-white/10" : isRetro ? "bg-[#6699ff]/20" : "bg-black/10"} />
              <DropdownMenuItem asChild className={cn(
                isDefault ? "text-white/70 hover:text-white focus:text-white focus:bg-white/5" : isRetro ? "text-gray-700 hover:text-black focus:text-black focus:bg-[#6699ff]/10" : "text-gray-700 hover:text-black focus:text-black focus:bg-amber-100"
              )}>
                <Link href={`/${locale}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Landing Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className={isDefault ? "bg-white/10" : isRetro ? "bg-[#6699ff]/20" : "bg-black/10"} />
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
