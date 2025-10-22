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
      className={`px-4 py-2 border-2 border-retro-black font-bold text-sm transition-all ${
        isMikuMode
          ? "text-retro-black"
          : "bg-retro-white text-retro-black hover:bg-retro-gray"
      }`}
      style={{
        boxShadow: "3px 3px 0px #000000",
        backgroundColor: isMikuMode ? "#39c5bb" : undefined,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
    >
      +Miku
    </motion.button>
  );
}
