import { motion } from "framer-motion";

interface ToggleButtonProps {
  readonly isOpen: boolean;
  readonly onClick: () => void;
}

export default function ToggleButton({ isOpen, onClick }: ToggleButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 bg-retro-black text-retro-white p-3 border-2 border-retro-black hover:bg-retro-white hover:text-retro-black transition-colors"
      style={{ boxShadow: "4px 4px 0px #000000" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <path
            d="M12 8L6 14L7.5 15.5L12 11L16.5 15.5L18 14L12 8Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="miter"
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}
