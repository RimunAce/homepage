import { motion } from "framer-motion";
import Link from "next/link";

export default function GalleryNav() {
  return (
    <nav className="bg-retro-white border-b-2 border-retro-black relative z-10">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex flex-wrap gap-2">
          <Link href="/" passHref legacyBehavior>
            <motion.a
              className="retro-button text-sm"
              whileTap={{ scale: 0.95 }}
            >
              HOME
            </motion.a>
          </Link>
          <Link href="/gallery" passHref legacyBehavior>
            <motion.a
              className="retro-button text-sm"
              whileTap={{ scale: 0.95 }}
            >
              GALLERY
            </motion.a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
