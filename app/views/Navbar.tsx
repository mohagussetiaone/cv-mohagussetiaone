"use client";

import React from "react";
import { Instagram, Github, Linkedin } from "lucide-react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50">
      <div className="flex flex-wrap bg-dark border-b border-gray-600 items-center justify-between mx-auto p-4">
        <div className="flex gap-4 justify-start ">
          <h1 className="text-3xl text-brand-500 bg-dark">{`</>`}</h1>
          <h2 className="text-xl mt-1 text-white">Moh Agus Setiawan</h2>
        </div>
        <div className="md:w-auto" id="navbar-default">
          <ul className="font-medium flex gap-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="flex gap-2">
              <Instagram className="text-brand-500" />
              <Link href="https://www.instagram.com/mohagussetiaone" className="hidden md:block text-white rounded" aria-current="page" target="_blank">
                Instagram
              </Link>
            </li>
            <li className="flex gap-2">
              <Github className="text-brand-500" />
              <Link href="https://github.com/mohagussetiaone" className="hidden md:block text-white rounded" target="_blank">
                Github
              </Link>
            </li>
            <li className="flex gap-2">
              <Linkedin className="text-brand-500" />
              <Link href="https://www.linkedin.com/in/mohagussetiaone" className="hidden md:block text-white rounded" target="_blank">
                Linkedin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
