"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

export const FloatingDock = ({ items, desktopClassName, mobileClassName }: { items: { title: string; icon: React.ReactNode; href: string }[]; desktopClassName?: string; mobileClassName?: string }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({ items, className }: { items: { title: string; icon: React.ReactNode; href: string }[]; className?: string }) => {
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  return (
    <div className={cn("fixed z-50 bottom-0 left-0 right-0 p-4 md:hidden", className)}>
      {/* No card wrapper — items float independently */}
      <div className="flex gap-5 justify-center">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: idx * 0.05 }}>
              <Link
                href={item.href}
                className={cn(
                  "h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1",
                  isNeo && "bg-amber-400 border-[3px] border-black shadow-[4px_4px_0px_0px_black] [&_svg]:text-black active:shadow-none active:translate-x-0 active:translate-y-0",
                  isRetro && "bg-white border-2 border-[#6699ff] [&_svg]:text-[#6699ff] hover:bg-blue-50 shadow-lg shadow-[#6699ff]/20",
                  !isNeo && !isRetro && "bg-white/10 backdrop-blur-md border border-white/20 [&_svg]:text-white hover:bg-white/20 shadow-lg shadow-black/20",
                )}
              >
                <div className="h-6 w-6">
                  {item.icon}
                  <span className="sr-only">Deskripsi Tautan</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }: { items: { title: string; icon: React.ReactNode; href: string }[]; className?: string }) => {
  return (
    <div className={cn("fixed top-1/2 left-4 transform -translate-y-1/2 flex-col items-center gap-3 md:flex hidden", className)}>
      {/* No card wrapper — items float independently */}
      <AnimatePresence>
        {items.map((item, idx) => (
          <motion.div key={item.href} initial={{ opacity: 0, x: -10, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: idx * 0.05 }}>
            <IconContainer {...item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function IconContainer({ icon, href }: { title: string; icon: React.ReactNode; href: string }) {
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  return (
    <Link href={href}>
      <motion.div
        className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-x-0.5",
          isNeo && "bg-amber-400 border-[3px] border-black shadow-[4px_4px_0px_0px_black] [&_svg]:text-black active:shadow-none active:translate-x-0 active:translate-y-0",
          isRetro && "bg-white border-2 border-[#6699ff] [&_svg]:text-[#6699ff] hover:bg-blue-50 shadow-lg shadow-[#6699ff]/20",
          !isNeo && !isRetro && "bg-white/10 backdrop-blur-md border border-white/20 [&_svg]:text-white hover:bg-white/20 shadow-lg shadow-black/20",
        )}
        whileHover={{ scale: 1.15 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="h-6 w-6">
          {icon}
          <span className="sr-only">Deskripsi Tautan</span>
        </div>
      </motion.div>
    </Link>
  );
}
