"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/app/store/projectStore";
import { useTranslations } from "next-intl";

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

const Works: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("Works");
  const { setSelectedProject } = useProjectStore();
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [loading, setLoading] = useState(false);

  const projectData: Project[] = [
    {
      product_id: 1,
      project_name: "Client Area Nethome",
      description: `${t("description_project_1")}`,
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
      description: `${t("description_project_2")}`,
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
      description: `${t("description_project_3")}`,
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
      description: `${t("description_project_4")}`,
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
      description: `${t("description_project_5")}`,
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
      description: `${t("description_project_6")}`,
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
      description: `${t("description_project_7")}`,
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
      description: `${t("description_project_8")}`,
      image: "/project/tanidealsapp.png",
      technologies: [Technology.FIGMA],
      urlPreview: "https://www.figma.com/proto/vV1zYKypYPe8bBS5mWyyP8/Tani-Deals-App-UI?node-id=7-3&node-type=canvas&t=roF7vYPt7FGuCZPq-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=75%3A2029",
      githubUrl: null,
      figmaUrl: "https://www.figma.com/design/vV1zYKypYPe8bBS5mWyyP8/Tani-Deals-App-UI?node-id=0-1&t=roF7vYPt7FGuCZPq-1",
      internal: false,
    },
  ];

  const showMoreProducts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 5);
      setLoading(false);
    }, 1000);
  };

  const handleDetailProject = (productId: number) => {
    const selectedProject = projectData.find((project) => project.product_id === productId);
    if (selectedProject) {
      setSelectedProject(selectedProject); // Menyimpan project ke store
    }
    router.push(`/project/${productId}`);
  };

  return (
    <div className="py-4 md:py-24 px-4 md:px-24" id="portfolio">
      <div className="py-10 relative">
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-center text-4xl text-brand-500 underline">{t("title")}</h1>
          <p className="text-white">{t("description")}</p>
        </div>
        <div className="absolute text-brand-500 -top-4 md:-top-10 left-5 md:right-24 text-[3rem] md:text-[5rem]">{`</>`}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:mx-auto">
        {projectData.slice(0, visibleProducts).map((project, index) => (
          <div key={project.product_id} onClick={() => handleDetailProject(project.product_id)}>
            <div
              className={`relative flex justify-center rounded-xl min-w-[160px] xl:min-w-[200px] max-w-[250px] min-h-[300px] flex-col overflow-hidden border border-gray-100 bg-black shadow-md transform transition duration-500 hover:scale-105 ${
                index === visibleProducts - 1 ? "mb-6" : ""
              }`}
            >
              <div className="relative flex h-32 xl:h-40 overflow-hidden">
                <Image className="object-cover" width={250} height={140} src={project.image || ""} alt={project.project_name} />
              </div>
              <div className="mt-2 md:mt-2 px-2 md:px-2 pb-2 md:pb-2">
                <div>
                  <div className="flex flex-col text-left text-neutral-100">
                    <h5 className="text-sm md:text-base font-bold ">{project.project_name}</h5>
                    <p className="line-clamp-2 text-xs md:text-sm">{project.description}</p>
                  </div>
                  {/* Render technology tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-300 dark:bg-secondaryDark text-black dark:text-neutral-200 text-xs font-semibold mr-2 py-0 px-1 rounded">
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleProducts < projectData.length && (
        <div className="flex justify-center my-6 xl:my-10">
          <Button onClick={showMoreProducts} className="bg-white text-black hover:bg-gray-200">
            {loading ? "Loading..." : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Works;
