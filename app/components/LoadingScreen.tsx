"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const hasLoadedKey = "respire_initial_load";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.sessionStorage.getItem(hasLoadedKey)) return;
    window.sessionStorage.setItem(hasLoadedKey, "true");
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const skip = () => setIsLoading(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        skip();
      }
    };

    const timer = setTimeout(skip, 1500);
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          role="dialog"
          aria-label="Welcome"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#e0e0e0]"
          onClick={() => setIsLoading(false)}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-3" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-black rounded-full loading-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            <div className="text-center loading-text">
              <p
                className="text-2xl font-bold tracking-wider text-black"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                respire.my
              </p>
              <button
                type="button"
                className="mt-4 text-xs underline"
                onClick={() => setIsLoading(false)}
              >
                Skip
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes dotRise {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-12px) scale(1.05); }
            }
            @keyframes textPulse {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
            .loading-dot {
              animation: dotRise 0.8s ease-out infinite;
            }
            .loading-text {
              animation: textPulse 2s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .loading-dot,
              .loading-text {
                animation: none;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
