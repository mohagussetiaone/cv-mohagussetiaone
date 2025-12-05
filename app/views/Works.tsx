"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/app/store/projectStore";
import { useTranslations, useLocale } from "next-intl";
import { projectData } from "@/app/constant/project";

const Works: React.FC = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Works");
  const { setSelectedProject } = useProjectStore();
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [loading, setLoading] = useState(false);

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

    router.push(`/${locale}/project/${productId}`);
  };

  return (
    <div className="py-4 md:py-24 px-4 md:px-24" id="portfolio">
      <div className="py-10 relative">
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-center text-4xl text-brand-500 underline">{t("title")}</h1>
          <p className="text-white text-center">{t("description")}</p>
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
                    <h2 className="text-sm md:text-base font-bold line-clamp-1">{project.project_name}</h2>
                    <p className="line-clamp-2 text-xs md:text-sm">{t(project.description)}</p>
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
