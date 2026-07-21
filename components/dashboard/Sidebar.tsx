"use client";

import Link from "next/link";
import { FolderKanban, LayoutDashboard, LockKeyhole, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Badge } from "@/components/ui/badge";

type SidebarProps = {
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

export function Sidebar({ locale }: SidebarProps) {
  return (
    <aside className="sticky top-0 h-screen w-72 shrink-0 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <Link href={`/${locale}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-black/40">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-black shrink-0">
          <UserRound className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">CV Admin</p>
          <h1 className="text-lg font-semibold">Moh Agus Dashboard</h1>
        </div>
        <Badge variant="secondary" className="shrink-0">
          Private
        </Badge>
      </Link>

      <nav className="mt-8 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <a key={item.label} href={item.href} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white")}>
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
