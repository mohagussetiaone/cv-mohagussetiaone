import React from "react";
import Image from "next/image";
import ProgrammerImage from "@/app/assets/image/about/Programmer.png";

const About = () => {
  return (
    <section className="py-20 px-4 md:px-8" id="about">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <div>
          <div className="inline-block border-2 border-brand-500 p-2 rounded-tl-xl rounded-br-xl mb-8">
            <h1 className="text-2xl font-bold text-white px-4">About Me</h1>
          </div>
          <div className="rounded-xl bg-black">
            <div className="text-white p-5">
              <span className="text-sm text-brand-500">{`<p>`}</span>
              <p className="text-2xl">My name is Moh Agus Setiawan</p>
              <p className="text-lg">
                A frontend developer specializing in building responsive, high-performance web applications using technologies like HTML, CSS, JavaScript, and React. I am passionate about crafting clean, maintainable, and scalable code that
                delivers great user experiences. I am a lifelong learner, driven by curiosity and a desire to continuously improve my skills and adapt to the ever-evolving web development landscape. Outside of coding, I enjoy sharing
                knowledge through writing blogs, staying active by playing badminton, and embracing challenges that broaden my perspective.
              </p>
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
