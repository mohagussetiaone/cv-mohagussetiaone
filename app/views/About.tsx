import React from "react";
import Image from "next/image";
import ProgrammerImage from "@/app/assets/image/about/Programmer.png";
import { useTranslations } from "next-intl";

const About = () => {
  const t = useTranslations("About");

  return (
    <section className="py-20 px-4 md:px-8" id="about">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <div>
          <div className="inline-block border-2 border-brand-500 p-2 rounded-tl-xl rounded-br-xl mb-8">
            <h1 className="text-2xl font-bold text-white px-4">{t("title")}</h1>
          </div>
          <div className="rounded-xl bg-black">
            <div className="text-white p-5">
              <span className="text-sm text-brand-500">{`<p>`}</span>
              <p className="text-2xl">{t("name")}</p>
              <p className="text-lg">{t("description")}</p>
              <span className="text-sm text-brand-500">{`<p/>`}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Image src={ProgrammerImage} alt="Programmer" width={1300} height={1200} />
        </div>
      </div>
    </section>
  );
};

export default About;
