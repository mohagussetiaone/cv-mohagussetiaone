"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, FolderKanban, LayoutDashboard, LockKeyhole, Sparkles, UserRound, X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MobileNavProps = {
  locale: string;
};

const navItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "#overview",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "#projects",
  },
  {
    label: "Content Plan",
    icon: Sparkles,
    href: "#content-plan",
  },
  {
    label: "Access",
    icon: LockKeyhole,
    href: "#access",
  },
];

export function MobileNav({ locale }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between gap-4 border-b border-white/10 bg-black/40 backdrop-blur px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="text-white hover:bg-white/10">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href={`/${locale}`} className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black flex-shrink-0">
              <UserRound className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 truncate">CV Admin</p>
              <h1 className="text-sm font-semibold truncate">Dashboard</h1>
            </div>
          </div>
        </Link>
        <Badge variant="secondary" className="shrink-0">
          Private
        </Badge>
      </div>

      {/* Mobile Sidebar Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}

      {/* Mobile Sidebar */}
      <div
        className={cn("fixed left-0 top-0 bottom-0 z-40 w-72 overflow-y-auto rounded-r-3xl border-r border-white/10 bg-black/80 backdrop-blur p-6 transition-transform duration-300 md:hidden", open ? "translate-x-0" : "-translate-x-full")}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-black flex-shrink-0">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">CV Admin</p>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white")}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
