import React from "react";
import Image from "next/image";
import htmllimaImage from "@/app/assets/image/skills/html5.png";
import cssImage from "@/app/assets/image/skills/css.png";
import jsImage from "@/app/assets/image/skills/js.png";
import reactImage from "@/app/assets/image/skills/react.png";

const skillData = [
  {
    name: "HTML",
    image: htmllimaImage,
    bgColor: "#E54F26",
    textColor: "#E54F26",
  },
  {
    name: "CSS",
    image: cssImage,
    bgColor: "#0C73B8",
    textColor: "#0C73B8",
  },
  {
    name: "JAVASCRIPT",
    image: jsImage,
    bgColor: "#E7A020",
    textColor: "#E7A020",
  },
  {
    name: "REACT JS",
    image: reactImage,
    bgColor: "#28A9E0",
    textColor: "#28A9E0",
  },
];

const Skills = () => {
  return (
    <section className="py-20" id="skills">
      <div className="relative">
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-center text-4xl text-brand-500 underline">Skills</h1>
          <p className="text-white">I am striving to never stop learning and improving</p>
        </div>
        <div className="absolute text-brand-500 -top-4 md:-top-10 right-5 md:right-24 text-[3rem] md:text-[5rem]">{`</>`}</div>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 justify-items-center items-center py-20">
        {skillData.map((skill, index) => (
          <div key={index} className="flex flex-col justify-center items-center col-span-2 md:col-span-1 gap-4">
            <div className={`p-8 rounded-full`} style={{ backgroundColor: skill.bgColor }}>
              <Image src={skill.image} alt={skill.name} width={30} height={30} />
            </div>
            <h2 className="text-xl" style={{ color: skill.textColor }}>
              {skill.name}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
