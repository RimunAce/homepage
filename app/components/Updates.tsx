"use client";

import { useState, useEffect } from "react";

interface Update {
  date: string;
  time: string;
  content: string;
}

export default function Updates() {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    fetch("/data/updates.json")
      .then((res) => res.json())
      .then((data) => setUpdates(data))
      .catch((error) => console.error("Error loading updates:", error));
  }, []);

  return (
    <section id="updates" className="retro-card">
      <h2 className="retro-heading">UPDATES</h2>
      <div className="space-y-3 max-h-[280px] overflow-y-auto retro-scrollbar pr-2">
        {updates.map((update, index) => (
          <div
            key={index}
            className="border-l-4 border-retro-black pl-3 pb-3 last:pb-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-retro-black text-retro-white px-2 py-0.5">
                {update.date}
              </span>
              <span className="text-xs text-retro-black opacity-60">
                {update.time}
              </span>
            </div>
            <p className="retro-text text-xs leading-relaxed">
              {update.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
