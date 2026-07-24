"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { Award, BookOpen, Briefcase, FileText, FolderIcon, LayoutDashboardIcon, MessageSquare } from "lucide-react";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";

const createSidebarData = (locale: string) => ({
  navMain: [
    {
      title: "Dashboard",
      url: `/${locale}/dashboard`,
      icon: LayoutDashboardIcon,
    },
    {
      title: "Projects",
      url: `/${locale}/dashboard/project`,
      icon: FolderIcon,
    },
    {
      title: "Content",
      url: `/${locale}/dashboard/content`,
      icon: FileText,
    },
    {
      title: "Works",
      url: `/${locale}/dashboard/works`,
      icon: Briefcase,
    },
    {
      title: "Education",
      url: `/${locale}/dashboard/education`,
      icon: BookOpen,
    },
    {
      title: "Certification",
      url: `/${locale}/dashboard/certification`,
      icon: Award,
    },
    {
      title: "Messages",
      url: `/${locale}/dashboard/messages`,
      icon: MessageSquare,
    },
  ],
});

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  locale: string;
  userEmail?: string;
  userName?: string;
};

export function AppSidebar({ locale, userEmail, userName, ...props }: AppSidebarProps) {
  const data = createSidebarData(locale);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={`/${locale}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent text-sidebar-foreground">
                  <span className="text-sm font-semibold">MA</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Moh Agus CV</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">Private workspace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
