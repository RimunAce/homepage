import { motion } from "framer-motion";

interface MikuToggleButtonProps {
  readonly isMikuMode: boolean;
  readonly onClick: () => void;
}

export default function MikuToggleButton({
  isMikuMode,
  onClick,
}: MikuToggleButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`inline-flex min-h-11 cursor-pointer items-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        isMikuMode
          ? "border-miku/70 bg-miku text-black hover:bg-miku/90"
          : "border-[#626979] bg-white/[0.06] text-white hover:border-[#8d94a3] hover:bg-white/[0.12]"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
      aria-label={isMikuMode ? "Switch to Teto playlist" : "Switch to Miku playlist"}
      aria-pressed={isMikuMode}
    >
      +Miku
    </motion.button>
  );
}
