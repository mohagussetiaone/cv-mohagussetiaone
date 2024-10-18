import React from "react";
import Image from "next/image";
import ProgrammerImage from "@/app/assets/image/about/Programmer.png";

const About = () => {
  return (
    <section className="py-14 p-4">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <div>
          <div className="inline-block border-2 border-brand-500 p-2 rounded-tl-xl rounded-br-xl mb-8">
            <h1 className="text-2xl font-bold text-white px-4">About Me</h1>
          </div>
          <div className="rounded-xl bg-black">
            <div className="text-white p-5">
              <div className="text-sm text-brand-500 py-4">{`<p>`}</div>
              <h1 className="text-5xl text-brand-500">Halo !</h1>
              <p className="text-lg">My name is Moh Agus Setiawan and I specialize in web developement that utilizes HTML, CSS, JS, and REACT etc. </p>
              <p>
                I am a highly motivated individual and eternal optimist dedicated to writing clear, concise, robust code that works. Striving to never stop learning and improving. When I&apos;m not coding, I am writing bolgs, reading, or
                picking up some new hands-on art project like photography.
              </p>
              <p>I like to have my perspective and belief systems challenged so that I see the world through new eyes.</p>
              <div className="text-sm text-brand-500 py-4">{`<p>`}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Image src={ProgrammerImage} alt="Programmer" width={1000} height={1000} />
        </div>
      </div>
    </section>
  );
};

export default About;
