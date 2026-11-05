import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import SafeImage from "../components/SafeImage";

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
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!image) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [image, onClose]);

  const label = image?.caption || "Photo";

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-5xl flex-col items-end gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="retro-button bg-retro-white text-retro-black"
              onClick={onClose}
            >
              Close
            </button>
            <div className="w-full min-w-0 border-4 border-retro-white bg-retro-black">
              <SafeImage
                src={image.url}
                alt={label}
                width={image.width || 1200}
                height={image.height || 800}
                className="max-h-[70vh] w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 80rem"
                priority
                fallbackLabel="Photo unavailable"
              />
              {image.caption && (
                <p className="break-words px-3 py-2 text-sm font-mono text-retro-white">
                  {image.caption}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
