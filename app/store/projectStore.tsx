import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

enum Technology {
  REACT = "React",
  FIGMA = "Figma",
  NEXT_JS = "Next.js",
  VITE_JS = "Vite.js",
  SUPABASE = "Supabase",
  PRISMA = "Prisma",
  VERCEL = "Vercel",
  TAILWIND_CSS = "Tailwind CSS",
  TYPESCRIPT = "TypeScript",
  NODE_JS = "Node.js",
  AXIOS = "Axios",
  OTHERS = "Others",
}

interface Project {
  product_id: number;
  project_name: string;
  description: string;
  image: string | undefined;
  technologies: Technology[];
  urlPreview: string | null;
  githubUrl: string | null;
  figmaUrl: string | null;
  internal: boolean;
}

interface ProjectStore {
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
    }),
    {
      name: "project-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
