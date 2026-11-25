import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import HomeDrawer from "./components/HomeDrawer";
import HomeLately from "./components/HomeLately";
import SelectedWork from "./components/SelectedWork";
import Updates from "./components/Updates";
import Webring from "./components/Webring";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-6 text-[#f2f3f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-8 sm:pt-8"
    >
      <div data-swarm-step>
        <Bio />
      </div>
      <HomeLately />
      <div className="mt-10 sm:mt-16">
        <HomeDrawer id="updates" title="Diary" preview="Life and site notes">
          <Updates />
        </HomeDrawer>
        <HomeDrawer id="projects" title="Things I've Made" preview="Projects and experiments">
          <Projects />
        </HomeDrawer>
        <HomeDrawer id="work" title="Selected Work" preview="Projects I've worked on with others">
          <SelectedWork />
        </HomeDrawer>
        <HomeDrawer id="contact" title="Bother Me" preview="GitHub, Discord and email">
          <Contact />
        </HomeDrawer>
      </div>
      <div className="mt-16 sm:mt-24">
        <Webring />
      </div>
    </main>
  );
}
