"use client";

import { useState, useEffect } from "react";
import { fetchUpdates, type Update } from "@/app/lib/content";

export default function Updates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUpdates() {
      try {
        const data = await fetchUpdates();
        if (!cancelled) {
          setUpdates(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setUpdates([]);
          setError("Could not load updates right now. Try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUpdates();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {loading && (
          <div className="space-y-3 py-2" role="status">
            <p className="text-sm text-[#aeb5c4]">Loading updates.</p>
        </div>
      )}

      {error && !loading && (
        <div className="border border-[#d8b9a6]/60 bg-[#241e1b] p-4" role="alert">
          <p className="text-sm font-mono text-white">{error}</p>
        </div>
      )}

      {!loading && !error && updates.length === 0 && (
        <p className="text-sm text-[#aeb5c4]">No updates yet.</p>
      )}

      {!loading && updates.length > 0 && (
        <div>
          {updates.map((update, index) => (
            <article
              key={`${update.date}-${update.time}-${update.content.slice(0, 24)}`}
              className={`grid gap-1 border-b border-white/10 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 ${index === 0 ? "py-6" : "py-5"}`}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:flex-col sm:items-start sm:gap-1 sm:pt-1">
                <span className="font-mono text-xs text-[#f2f3f6]">{update.date}</span>
                <span className="font-mono text-xs text-[#aeb5c4]">{update.time}</span>
              </div>
              <p className={`max-w-[68ch] leading-relaxed text-[#f2f3f6] ${index === 0 ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}>{update.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
