"use client";

import { BarChart3, FolderLock, FolderOpen, Layers, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNeo } from "@/components/dashboard/neo";

type ProjectStatsProps = {
  totalProjects: number;
  internalProjects: number;
  publicProjects: number;
  totalSkills: number;
  totalCategories: number;
};

const stats = (data: ProjectStatsProps) => [
  {
    label: "Total Project",
    value: data.totalProjects,
    helper: "Semua project di CV",
    icon: BarChart3,
    gradient: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    label: "Public",
    value: data.publicProjects,
    helper: "Tampil dengan link preview",
    icon: FolderOpen,
    gradient: "from-sky-500/20 to-sky-500/5",
    border: "border-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    label: "Internal",
    value: data.internalProjects,
    helper: "Portofolio privat",
    icon: FolderLock,
    gradient: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    label: "Skill Tags",
    value: data.totalSkills,
    helper: "Teknologi tersimpan",
    icon: Wrench,
    gradient: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    label: "Categories",
    value: data.totalCategories,
    helper: "Kelompok project",
    icon: Layers,
    gradient: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
  },
];

export function ProjectStats(props: ProjectStatsProps) {
  const { isNeo } = useNeo();

  return (
    <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {stats(props).map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={cn(
              "group relative overflow-hidden p-5 transition-all duration-300",
              isNeo
                ? "border-[3px] border-black bg-white shadow-[5px_5px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_black]"
                : `rounded-2xl border ${item.border} bg-linear-to-br ${item.gradient} hover:scale-[1.02] hover:shadow-lg`,
            )}
          >
            {!isNeo && <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-400/10 blur-2xl" />}
            <div className="flex items-start justify-between">
              <p className={cn("text-sm font-medium", isNeo ? "text-black" : "text-black")}>{item.label}</p>
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center", isNeo ? "border-2 border-black bg-amber-400 shadow-[2px_2px_0px_0px_black]" : "")}>
                <Icon className={cn("h-4 w-4", isNeo ? "text-black" : item.iconColor)} />
              </span>
            </div>
            <p className={cn("mt-3 text-3xl font-bold", isNeo ? "text-black" : "text-black")}>{item.value}</p>
            <p className={cn("mt-1 text-xs", isNeo ? "text-black" : "text-black")}>{item.helper}</p>
          </div>
        );
      })}
    </section>
  );
}
