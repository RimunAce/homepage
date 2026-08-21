"use client";

import { useState, useEffect } from "react";
import { DATA_URLS } from "@/app/lib/dataUrls";

interface Update {
  date: string;
  time: string;
  content: string;
}

const FALLBACK_UPDATES: Update[] = [
  {
    date: "2025-06",
    time: "12:00",
    content:
      "Site is running on Next.js 16 with a fresh retro redesign. Browse around!",
  },
  {
    date: "2025-05",
    time: "09:30",
    content:
      "Added music player with playlist switching — check out the Music page.",
  },
  {
    date: "2025-04",
    time: "14:15",
    content: "Gallery and AniList integration are now live.",
  },
];

export default function Updates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUpdates() {
      try {
        const res = await fetch(DATA_URLS.updates);
        if (!res.ok) throw new Error("Failed to fetch updates");
        const data = await res.json();
        if (!cancelled) {
          setUpdates(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setUpdates(FALLBACK_UPDATES);
          setError("Could not load latest updates — showing cached data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUpdates();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="updates" className="retro-card">
      <h2 className="retro-heading">UPDATES</h2>

      {loading && (
        <div className="max-h-72 overflow-hidden space-y-3 py-2 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border-l-2 border-retro-gray pl-3 pb-3 space-y-2">
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-retro-gray border border-retro-black" />
                <div className="h-4 w-10 bg-retro-gray border border-retro-black" />
              </div>
              <div className="h-3 bg-retro-gray border border-retro-black w-full" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-retro-yellow border-2 border-retro-black p-3 mb-3">
          <p className="text-xs font-mono text-retro-black">{error}</p>
        </div>
      )}

      {!loading && updates.length === 0 && (
        <p className="retro-text text-xs">No updates yet.</p>
      )}

      {!loading && updates.length > 0 && (
        <div
          tabIndex={0}
          aria-label="Site updates"
          className="max-h-72 overflow-y-auto overscroll-contain retro-scrollbar pr-1"
        >
          <div className="space-y-3">
            {updates.map((update) => (
              <div
                key={`${update.date}-${update.time}-${update.content.slice(0, 24)}`}
                className="border-l-2 border-retro-black pl-3 pb-3 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold bg-retro-black text-retro-white px-2 py-0.5">
                    {update.date}
                  </span>
                  <span className="text-xs text-retro-black opacity-60">
                    {update.time}
                  </span>
                </div>
                <p className="retro-text text-xs leading-relaxed">{update.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
