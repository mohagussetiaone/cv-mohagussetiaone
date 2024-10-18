import NavHome from "./views/NavHome";
import Banner from "./views/Banner";
import About from "./views/About";
import Skills from "./views/Skills";
import Works from "./views/Works";

export default function Home() {
  return (
    <main>
      <Banner />
      <About />
      <Skills />
      <Works />
      <NavHome />
    </main>
  );
}
