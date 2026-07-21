import { BarChart3, FolderLock, FolderOpen, Layers, Wrench } from "lucide-react";

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
  return (
    <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {stats(props).map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`group relative overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.gradient} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5 blur-2xl" />
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-white/60">{item.label}</p>
              <Icon className={`h-4 w-4 ${item.iconColor}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
            <p className="mt-1 text-xs text-white/40">{item.helper}</p>
          </div>
        );
      })}
    </section>
  );
}
