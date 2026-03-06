"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Track if we've shown the loading screen already in this session
const hasLoadedKey = "respire_initial_load";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if this is the first load in this session
    const hasLoaded = sessionStorage.getItem(hasLoadedKey);
    
    if (!hasLoaded) {
      setIsLoading(true);
      sessionStorage.setItem(hasLoadedKey, "true");
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#e0e0e0]"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-black rounded-full loading-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            <div className="text-center loading-text">
              <h2
                className="text-2xl font-bold tracking-wider text-black"
                style={{
                  fontFamily: "'Courier New', monospace",
                }}
              >
                preparing your experience
              </h2>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes dotBounce {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-20px) scale(1.1); }
            }
            @keyframes textPulse {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
            .loading-dot {
              animation: dotBounce 0.8s ease-in-out infinite;
            }
            .loading-text {
              animation: textPulse 2s ease-in-out infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
