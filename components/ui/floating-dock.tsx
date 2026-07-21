"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const FloatingDock = ({ items, desktopClassName, mobileClassName }: { items: { title: string; icon: React.ReactNode; href: string }[]; desktopClassName?: string; mobileClassName?: string }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({ items, className }: { items: { title: string; icon: React.ReactNode; href: string }[]; className?: string }) => {
  return (
    <div className={cn("fixed z-50 bottom-0 left-0 right-0 p-4 md:hidden", className)}>
      <motion.div className="flex gap-4 justify-center">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10, scale: 0.8 }} // Awal scale lebih kecil
              animate={{ opacity: 1, y: 0, scale: 1 }} // Zoom in saat muncul
              exit={{ opacity: 0, y: 10, scale: 0.8 }} // Zoom out saat hilang
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={item.href} className="h-14 w-14 rounded-full flex items-center justify-center bg-black">
                <div className="h-6 w-6">
                  {item.icon}
                  <span className="sr-only">Deskripsi Tautan</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }: { items: { title: string; icon: React.ReactNode; href: string }[]; className?: string }) => {
  return (
    <motion.div className={cn("fixed top-1/2 left-0 transform -translate-y-1/2 flex-col items-center p-4 gap-4 rounded-tr-lg rounded-br-lg md:flex hidden", className)}>
      <AnimatePresence>
        {items.map((item) => (
          <IconContainer key={item.title} {...item} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

function IconContainer({ icon, href }: { title: string; icon: React.ReactNode; href: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        className="aspect-square rounded-full bg-black flex items-center justify-center relative p-4"
        whileHover={{ scale: 1.2 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center justify-center">
          {icon}
          <span className="sr-only">Deskripsi Tautan</span>
        </div>
      </motion.div>
    </Link>
  );
}
