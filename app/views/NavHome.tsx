import { FloatingDock } from "@/components/ui/floating-dock";
import { House, User, Rocket, BookmarkCheck, ContactRound } from "lucide-react";

export default function NavHome() {
  const links = [
    {
      title: "Home",
      icon: <House className="h-full w-full" />,
      href: "#home",
    },
    {
      title: "About",
      icon: <User className="h-full w-full" />,
      href: "#about",
    },
    {
      title: "Skills",
      icon: <Rocket className="h-full w-full" />,
      href: "#skills",
    },
    {
      title: "Portfolio",
      icon: <BookmarkCheck className="h-full w-full" />,
      href: "#portfolio",
    },
    {
      title: "Contact",
      icon: <ContactRound className="h-full w-full" />,
      href: "#contact",
    },
  ];

  return (
    <main>
      <FloatingDock items={links} />
    </main>
  );
}
