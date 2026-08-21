import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Updates from "./components/Updates";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-6xl mx-auto px-4 py-8 pb-36 relative z-10 focus:outline-none"
    >
      <Bio />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 overflow-visible">
        <div className="lg:col-span-2 min-w-0">
          <Updates />
        </div>
        <Contact />
      </div>
      <div className="mt-6">
        <Projects />
      </div>
    </main>
  );
}
