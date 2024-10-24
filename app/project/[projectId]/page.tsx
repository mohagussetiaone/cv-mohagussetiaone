"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, View, Figma } from "lucide-react";
import { useProjectStore } from "@/app/store/projectStore";

const ShowCaseDetail: React.FC = () => {
  const { selectedProject } = useProjectStore();

  return (
    <section className="body-font overflow-hidden p-4">
      <div className="container py-10 mx-auto">
        <div className="mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full md:pr-4">
            <div className="sticky top-4">
              <Image src={selectedProject?.image || ""} alt={selectedProject?.project_name || ""} className="w-full h-auto object-cover object-center rounded border border-gray-200" width={500} height={500} />
            </div>
          </div>
          <div className="lg:w-1/2 w-full lg:pl-6 mt-6 lg:mt-0 text-neutral-200">
            <h1 className="text-3xl title-font font-medium mb-1">{selectedProject?.project_name}</h1>
            <p className="text-base font-normal text-justify">{selectedProject?.description}</p>
            <div className="mt-4">
              <div className="mb-2">
                <h2 className="text-neutral-200 title-font font-medium">Teknologi yang dipakai :</h2>
              </div>
              {selectedProject?.technologies?.map((tech, index) => (
                <span key={index} className="bg-gray-300 dark:bg-secondaryDark text-black dark:text-neutral-200 text-xs font-semibold py-1 px-2 mx-1 rounded">
                  #{tech}
                </span>
              ))}
            </div>
            {selectedProject?.internal === true && (
              <div className="py-6">
                <p className="text-yellow-500 text-lg">
                  <strong>Catatan:</strong> Proyek ini bersifat <em>internal</em> dan tidak tersedia untuk publik. Hanya instansi terkait yang dapat mengakses pratinjau atau sumber proyek.
                </p>
              </div>
            )}
            {selectedProject?.internal !== true && (
              <div className="flex gap-4 mt-4 md:mt-6">
                <Link
                  href={selectedProject?.urlPreview || ""}
                  target="_blank"
                  className="flex gap-2 mt-6 text-gray-900 dark:text-brand-500 bg-white dark:bg-transparent hover:bg-gray-100 hover:text-black border border-black dark:border-brand-500 py-2 px-8 focus:outline-none rounded text-lg"
                >
                  <View className="w-5 h-5 mt-1" />
                  Preview
                </Link>
                {selectedProject?.githubUrl !== null && (
                  <Link href={selectedProject?.githubUrl || ""} target="_blank" className="flex gap-2 mt-6 text-white bg-black dark:bg-brand-700 border-0 py-2 px-8 focus:outline-none hover:bg-black/90 hover:text-white rounded text-lg">
                    <Github className="w-5 h-5 mt-1" />
                    Github
                  </Link>
                )}
                {selectedProject?.figmaUrl !== null && (
                  <Link href={selectedProject?.figmaUrl || ""} target="_blank" className="flex gap-2 mt-6 text-white bg-black dark:bg-brand-700 border-0 py-2 px-8 focus:outline-none hover:bg-black/90 hover:text-white rounded text-lg">
                    <Figma className="w-5 h-5 mt-1" />
                    Figma
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowCaseDetail;
