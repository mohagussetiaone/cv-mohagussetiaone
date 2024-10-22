"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StaticImageData } from "next/image";
import NethomeProject from "@/app/assets/image/project/nethome.png";
import WebOltProject from "@/app/assets/image/project/webolt.png";
import JajanianProject from "@/app/assets/image/project/jajanian.png";
import JvalleyverseProject from "@/app/assets/image/project/jvalleyverse.png";
import LaundrivyProject from "@/app/assets/image/project/laundrivy.png";
import DashboardJajanianProject from "@/app/assets/image/project/dashboard-jajanian.png";
import JvalleyverseDashboardProject from "@/app/assets/image/project/jvalleyverse-dashboard.png";
import TaniDealsAppProject from "@/app/assets/image/project/tanidealsapp.png";

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
  image: string | StaticImageData;
  technologies: Technology[];
}

const projectData: Project[] = [
  {
    product_id: 1,
    project_name: "Client Area Nethome",
    description:
      "Client Area Nethome is a comprehensive customer portal designed to enhance the Nethome experience. From seamless transactions and service management to convenient monthly bill tracking and responsive support access, it delivers an all-in-one solution for Nethome customers to control their services effortlessly.",
    image: NethomeProject,
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS],
  },
  {
    product_id: 2,
    project_name: "WEB OLT Management",
    description:
      "The WEB OLT Management system is engineered for precision in customer onboarding and network activation. With powerful tools for job scheduling and role-based access, it streamlines complex workflows, ensuring efficient management of customer connections.",
    image: WebOltProject,
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS],
  },
  {
    product_id: 3,
    project_name: "Jajanian",
    description:
      "Jajanian is a vibrant e-commerce platform designed for snack lovers. It allows easy ordering via WhatsApp and integrates various payment methods, making snack shopping more accessible. Currently, new features are in the pipeline to further enhance the customer experience.",
    image: JajanianProject,
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE, Technology.VERCEL],
  },
  {
    product_id: 4,
    project_name: "Jvalleyverse",
    description:
      "Jvalleyverse is an all-inclusive online learning platform offering free courses. It features structured learning paths, interactive forums, hands-on projects, and certificates for course completion, making it an ideal space for learners to grow and showcase their skills.",
    image: JvalleyverseProject,
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE, Technology.VERCEL],
  },
  {
    product_id: 5,
    project_name: "Laundrivy",
    description:
      "Laundrivy revolutionizes the laundry experience by providing customers with real-time order tracking, seamless transaction management, and live support chat. Its user-centric design makes laundry more convenient, efficient, and transparent for every user.",
    image: LaundrivyProject,
    technologies: [Technology.NEXT_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.PRISMA, Technology.VERCEL],
  },
  {
    product_id: 6,
    project_name: "Jajanian Dashboard",
    description:
      "The Jajanian Dashboard empowers businesses to optimize operations with its intuitive product and inventory management tools, detailed sales insights, and stock monitoring. It’s the ultimate solution for snack business owners to streamline and scale their operations.",
    image: DashboardJajanianProject,
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE, Technology.VERCEL],
  },
  {
    product_id: 7,
    project_name: "Jvalleyverse Dashboard",
    description:
      "The Jvalleyverse Dashboard offers comprehensive course management with user monitoring, notification systems, and dynamic blog and project showcase capabilities. It's the perfect tool for educators to manage online learning and provide a rich educational experience.",
    image: JvalleyverseDashboardProject,
    technologies: [Technology.VITE_JS, Technology.TAILWIND_CSS, Technology.AXIOS, Technology.SUPABASE, Technology.VERCEL],
  },
  {
    product_id: 8,
    project_name: "Tani Deals App",
    description:
      "Tani Deals App bridges the gap between farmers and distributors, facilitating easier access to markets. With built-in payment solutions and agricultural knowledge resources, it empowers farmers to sell their produce efficiently while learning key industry practices.",
    image: TaniDealsAppProject,
    technologies: [Technology.FIGMA],
  },
];

const Works: React.FC = () => {
  const router = useRouter();
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [loading, setLoading] = useState(false);

  const showMoreProducts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 5);
      setLoading(false);
    }, 1000);
  };

  const handleDetailProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="py-4 md:py-24 px-4 md:px-24" id="portfolio">
      <div className="py-10 relative">
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-center text-4xl text-brand-500 underline">Work</h1>
          <p className="text-white">I had the pleasure of working with these awesome projects</p>
        </div>
        <div className="absolute text-brand-500 -top-4 md:-top-10 left-5 md:right-24 text-[3rem] md:text-[5rem]">{`</>`}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:mx-auto">
        {projectData.slice(0, visibleProducts).map((product, index) => (
          <div key={product.product_id}>
            <div
              className={`relative flex justify-center rounded-xl min-w-[160px] xl:min-w-[200px] max-w-[250px] min-h-[300px] flex-col overflow-hidden border border-gray-100 bg-black shadow-md transform transition duration-500 hover:scale-105 ${
                index === visibleProducts - 1 ? "mb-6" : ""
              }`}
            >
              <div className="relative flex h-32 xl:h-40 overflow-hidden">
                <Image className="object-cover" width={150} height={140} src={product.image} alt={product.project_name} />
              </div>
              <div className="mt-2 md:mt-2 px-2 md:px-2 pb-2 md:pb-2">
                <div onClick={() => handleDetailProduct(product.product_id)}>
                  <div className="flex flex-col text-left text-neutral-100">
                    <h5 className="text-sm md:text-base font-bold ">{product.project_name}</h5>
                    <p className="line-clamp-2 text-xs md:text-sm">{product.description}</p>
                  </div>
                  {/* Render technology tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.technologies.map((tech) => (
                      <span key={tech} className="bg-gray-200 text-gray-800 text-xs font-semibold px-1 py-0.5 rounded">
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
