import { BarChart3, FolderLock, FolderOpen, Layers, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  },
  {
    label: "Public Project",
    value: data.publicProjects,
    helper: "Tampil dengan link preview",
    icon: FolderOpen,
  },
  {
    label: "Internal Project",
    value: data.internalProjects,
    helper: "Portofolio privat",
    icon: FolderLock,
  },
  {
    label: "Skill Tags",
    value: data.totalSkills,
    helper: "Teknologi tersimpan",
    icon: Wrench,
  },
  {
    label: "Categories",
    value: data.totalCategories,
    helper: "Kelompok project",
    icon: Layers,
  },
];

export function ProjectStats(props: ProjectStatsProps) {
  return (
    <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {stats(props).map((item) => (
        <Card key={item.label} className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-500">{item.label}</p>
              <item.icon className="h-4 w-4 text-slate-700" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-2 text-xs text-slate-500">{item.helper}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
