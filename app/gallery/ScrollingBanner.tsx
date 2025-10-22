import { motion } from "framer-motion";

export default function ScrollingBanner() {
  return (
    <div className="bg-retro-black text-retro-white py-1 overflow-hidden relative z-10">
      <motion.div
        className="flex whitespace-nowrap text-xs font-mono"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={`banner-${i}`} className="mx-4">
            WE ARE NOT FINISHED //
          </span>
        ))}
      </motion.div>
    </div>
  );
}
