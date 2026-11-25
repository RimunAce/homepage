import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import SafeImage from "../components/SafeImage";
import styles from "./gallery.module.css";

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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!image) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
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
          className={styles.lightbox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.16 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <div
            className={styles.lightboxContent}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className={styles.closeButton}
              onClick={onClose}
            >
              Close
            </button>
            <div className={styles.imageFrame} tabIndex={0} role="group" aria-label="Photo and caption">
              <SafeImage
                src={image.url}
                alt={label}
                width={image.width || 1200}
                height={image.height || 800}
                className={styles.lightboxImage}
                sizes="(max-width: 1024px) 100vw, 80rem"
                priority
                fallbackLabel="Photo unavailable"
              />
              {image.caption && (
                <p className={styles.caption}>
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
