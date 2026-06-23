"use client";

import Bio from "./components/Bio";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Updates from "./components/Updates";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Bio />
          <Projects />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Contact />
          <Updates />
        </div>
      </div>
    </main>
  );
}
