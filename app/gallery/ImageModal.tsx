import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface GalleryImage {
  url: string;
  width: number;
  height: number;
  caption?: string;
}

interface ImageModalProps {
  image: GalleryImage | null;
  onClose: () => void;
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-5xl max-h-[90vh] border-4 border-retro-white"
            style={{ boxShadow: "6px 6px 0px #ffffff" }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 retro-button bg-retro-white text-retro-black"
              onClick={onClose}
            >
              CLOSE
            </button>
            <div className="relative w-full h-full">
              <Image
                src={image.url}
                alt="Preview"
                width={1920}
                height={1080}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                priority
                unoptimized
              />
              {image.caption && (
                <div className="absolute bottom-4 left-4 bg-retro-black bg-opacity-80 text-retro-white px-3 py-2 border-2 border-retro-white max-w-md">
                  <p className="text-sm font-mono">
                    &quot;{image.caption}&quot;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
