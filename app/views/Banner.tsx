"use client";

import React from "react";
import Image from "next/image";
import MohAgusImage from "@/app/assets/image/profile/mohagus.jpeg";
import Link from "next/link";
import { Mail, MapPin, Briefcase, Link2, Download, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewritter-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const Banner = () => {
  const words = [
    {
      text: "Front End",
      className: "text-brand-500",
    },
    {
      text: "Developer.",
      className: "text-brand-500",
    },
  ];

  return (
    <section className="w-full py-4 md:pb-20 md:px-8" id="home">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-1 p-4 md:pr-10">
          <HoverBorderGradient>
            <div className="border border-gray-500 p-6 rounded-tl-[8rem] rounded-br-[8rem]">
              <div className="flex flex-col items-center justify-center mx-auto text-white py-6">
                <Image src={MohAgusImage} width={120} height={80} alt={"BannerImage.jpg"} className="object-contain rounded-full" />
              </div>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex gap-2">
                  <Mail className="w-6 h-6 text-brand-500" />
                  <h1 className="text-white">mohagussetiaone@gmail.com</h1>
                </div>
                <div className="flex gap-2">
                  <MapPin className="w-6 h-6 text-brand-500" />
                  <h1 className="text-white text-start">Menteng dalam, Kec tebet, Kota Jakarta Selatan</h1>
                </div>
                <div className="flex gap-2">
                  <Briefcase className="w-6 h-6 text-brand-500" />
                  <h1 className="text-white">Front End React Developer</h1>
                </div>
                <div className="flex gap-2">
                  <Link2 className="w-6 h-6 text-brand-500" />
                  <h1 className="text-white">https://mohagussetiaone.vercel.app</h1>
                </div>
                <div className="flex gap-2 text-xs md:text-sm text-black">
                  <span className="bg-brand-500 rounded-full px-2">HTML+CSS</span>
                  <span className="bg-brand-500 rounded-full px-2">JS</span>
                  <span className="bg-brand-500 rounded-full px-2">REACT</span>
                  <span className="bg-brand-500 rounded-full px-2">TAILWIND</span>
                </div>
              </div>
              <Button className="bg-white hover:bg-gray-300 text-black p-4 rounded-full text-lg my-4">
                Download CV
                <Download className="w-6 h-6" />
              </Button>
            </div>
          </HoverBorderGradient>
        </div>
        <div className="col-span-3 md:col-span-2 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-4 items-start justify-start md:mx-6">
              <span className="text-sm text-brand-500">{`<h1>`}</span>
              <h1 className="text-5xl text-white">Halo</h1>
              <h1 className="text-4xl text-white">I&apos;m Moh Agus Setiawan</h1>
              <TypewriterEffect words={words} />
              <span className="text-sm text-brand-500">{`<h1/>`}</span>
              <div className="py-6">
                <span className="text-sm text-brand-500">{`<p>`}</span>
                <p className="text-lg text-white">I help business grow by crafting amazing web experiences. If you&apos;re looking for a developer that likes to get stuff done, look no further.</p>
                <span className="text-sm text-brand-500">{`<p/>`}</span>
              </div>
              <div className="py-4 text-brand-500">
                <Link href="https://wa.me/6287885159098" className="flex gap-2 text-3xl" target="_blank">
                  Let&apos;s Talk
                  <span className="flex flex-col items-center justify-center bg-black rounded-full px-2">
                    <Phone className="w-6 h-6" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex w-full md:w-auto flex-col gap-8 md:gap-10 items-start md:items-center justify-start bg-black h-auto self-center p-6 rounded-3xl">
              <div className="flex gap-3">
                <div className="h-full flex justify-center items-center">
                  <h1 className="text-4xl text-brand-500">1</h1>
                </div>
                <div className="flex flex-col text-white">
                  <h2>Years Of</h2>
                  <h2>Experience</h2>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-full flex justify-center items-center">
                  <h1 className="text-4xl text-brand-500">3</h1>
                </div>
                <div className="flex flex-col text-white">
                  <h2>Programming</h2>
                  <h2>Language</h2>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-full flex justify-center items-center">
                  <h1 className="text-4xl text-brand-500">6</h1>
                </div>
                <div className="flex flex-col text-white">
                  <h2>Development</h2>
                  <h2>Tools</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
