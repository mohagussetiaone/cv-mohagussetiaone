// types/project.ts
import { StaticImageData } from "next/image";

// Enum untuk teknologi yang digunakan
export enum Technology {
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

// Tipe Project sesuai struktur data
export interface Project {
  product_id: number;
  project_name: string;
  description: string;
  image: string | StaticImageData;
  technologies: Technology[];
}
