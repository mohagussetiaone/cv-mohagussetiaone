import NavHome from "../views/NavHome";
import Banner from "../views/Banner";
import About from "../views/About";
import Skills from "../views/Skills";
import Works from "../views/Works";
import Contact from "../views/Contact";
import { getProjects } from "@/lib/projects";
import type { ProjectLocale } from "@/app/types/project";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const projects = await getProjects(locale as ProjectLocale);

  return (
    <main className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[44px_44px]" />
      <div className="mx-auto w-full max-w-6xl">
        <Banner />
        <About />
        <Skills />
        <Works locale={locale} projects={projects} />
        <Contact />
        <NavHome />
      </div>
    </main>
  );
}
