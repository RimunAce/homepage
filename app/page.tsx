import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Updates from "./components/Updates";
import Webring from "./components/Webring";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-6xl mx-auto px-4 py-6 sm:py-8 pb-8 relative z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
    >
      <Bio />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 overflow-visible">
        <div className="md:col-span-2 min-w-0">
          <Updates />
        </div>
        <Contact />
      </div>
      <div className="mt-6">
        <Projects />
      </div>
      <div className="mt-6">
        <Webring />
      </div>
    </main>
  );
}
