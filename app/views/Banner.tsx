"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Briefcase, Link2, Download, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewritter-effect";

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
    <section className="w-full py-10">
      <div className="grid grid-cols-3 gap-4 m-4">
        <div className="col-span-3 md:col-span-1 p-4 md:p-0">
          <div className="border border-gray-100 p-6 rounded-tl-[10rem] rounded-br-[10rem]">
            <div className="flex flex-col items-center justify-center mx-auto text-white">
              <Image
                src={"https://img.freepik.com/free-vector/mans-face-flat-style_90220-2877.jpg?t=st=1729237107~exp=1729240707~hmac=6e698073465cc296c77ed8a850e641ea5342ffba15cde687b0c4846272cb364a&w=740"}
                width={80}
                height={80}
                alt={"BannerImage.jpg"}
              />
              <div className="flex flex-col items-center justify-center py-4">
                <h1 className="text-3xl">Moh Agus Setiawan</h1>
                <h3 className="text-xl">Front End Developer</h3>
              </div>
            </div>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex gap-2">
                <Mail className="w-6 h-6 text-brand-500" />
                <h1 className="text-white">Moh Agus Setiawan</h1>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-6 h-6 text-brand-500" />
                <h1 className="text-white">Menteng dalam, Kec tebet, Kota Jakarta Selatan</h1>
              </div>
              <div className="flex gap-2">
                <Briefcase className="w-6 h-6 text-brand-500" />
                <h1 className="text-white">Fullstack Developer</h1>
              </div>
              <div className="flex gap-2">
                <Link2 className="w-6 h-6 text-brand-500" />
                <h1 className="text-white">https://mohagussetiaone.vercel.app</h1>
              </div>
              <div className="flex gap-2">
                <span className="bg-brand-500 rounded-full px-2">HTML+CSS</span>
                <span className="bg-brand-500 rounded-full px-2">JS</span>
                <span className="bg-brand-500 rounded-full px-2">REACT</span>
                <span className="bg-brand-500 rounded-full px-2">TAILWIND</span>
              </div>
            </div>
            <Button className="bg-white hover:bg-gray-300 p-4 rounded-full text-lg my-4">
              Download CV
              <Download className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <div className="col-span-3 md:col-span-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-4 items-start justify-start mx-6">
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
                  <span className="flex flex-col items-center justify-center bg-gray-500 rounded-full px-2">
                    <Phone className="w-6 h-6" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex w-full md:w-auto flex-col gap-8 md:gap-10 items-start md:items-center justify-between md:justify-center bg-black h-auto self-center p-6 rounded-3xl">
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
