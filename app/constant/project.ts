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

export const projectData: Project[] = [
  {
    product_id: 1,
    project_name: "Client Area Nethome",
    description: "description_project_1",
    image: "/project/nethome.png",
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS],
    urlPreview: null,
    githubUrl: null,
    figmaUrl: null,
    internal: true,
  },
  {
    product_id: 2,
    project_name: "WEB OLT Management",
    description: "description_project_2",
    image: "/project/webolt.png",
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS],
    urlPreview: null,
    githubUrl: null,
    figmaUrl: null,
    internal: true,
  },
  {
    product_id: 3,
    project_name: "Jajanian",
    description: "description_project_3",
    image: "/project/jajanian.png",
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE],
    urlPreview: "https://jajanian.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/jajanian.git",
    figmaUrl: null,
    internal: false,
  },
  {
    product_id: 4,
    project_name: "Jvalleyverse",
    description: "description_project_4",
    image: "/project/jvalleyverse.png",
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE],
    urlPreview: "https://jvalleyverse.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/jvalleyverse.git",
    figmaUrl: null,
    internal: false,
  },
  {
    product_id: 5,
    project_name: "Laundrivy",
    description: "description_project_5",
    image: "/project/laundrivy.png",
    technologies: [Technology.NEXT_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.PRISMA],
    urlPreview: "https://laundrivy.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/laundrivy.git",
    figmaUrl: null,
    internal: false,
  },
  {
    product_id: 6,
    project_name: "Jajanian Dashboard",
    description: "description_project_6",
    image: "/project/dashboard-jajanian.png",
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE],
    urlPreview: "https://jajanian-dashboard.vercel.app/",
    githubUrl: "https://github.com/mohagussetiaone/jajanian-dashboard.git",
    figmaUrl: null,
    internal: false,
  },
  {
    product_id: 7,
    project_name: "Jvalleyverse Dashboard",
    description: "description_project_7",
    image: "/project/jvalleyverse-dashboard.png",
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE],
    urlPreview: "https://jvalleyverse-dashboard.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/jvalleyverse-dashboard.git",
    figmaUrl: null,
    internal: false,
  },
  {
    product_id: 8,
    project_name: "Tani Deals App",
    description: "description_project_8",
    image: "/project/tanidealsapp.png",
    technologies: [Technology.FIGMA],
    urlPreview: "https://www.figma.com/proto/vV1zYKypYPe8bBS5mWyyP8/Tani-Deals-App-UI?node-id=7-3&node-type=canvas&t=roF7vYPt7FGuCZPq-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=75%3A2029",
    githubUrl: null,
    figmaUrl: "https://www.figma.com/design/vV1zYKypYPe8bBS5mWyyP8/Tani-Deals-App-UI?node-id=0-1&t=roF7vYPt7FGuCZPq-1",
    internal: false,
  },
];
