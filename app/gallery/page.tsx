"use client";

import { useState, useEffect } from "react";
import GalleryGrid from "./GalleryGrid";
import ImageModal from "./ImageModal";
import { fetchGallery, type GalleryImage } from "@/app/lib/content";
import styles from "./gallery.module.css";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    fetchGallery()
      .then((data) => {
        if (cancelled) return;
        setImages(data);
        setPhase("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setPhase("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`${styles.gallery} relative z-10 mx-auto w-full max-w-6xl px-4 py-6 pb-28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-8 sm:py-10`}
    >
      <header className={styles.intro}>
        <h1 className="font-sans text-3xl font-semibold leading-none tracking-tight sm:text-5xl">Gallery</h1>
        <p className={styles.description}>Photos Respire has put up. Open one for a larger view.</p>
      </header>
      {phase === "loading" && (
        <p className={`${styles.loading} mb-6`} role="status" aria-live="polite">
          Loading photos.
        </p>
      )}
      {phase === "error" && (
        <div className={`${styles.error} mb-6`} role="alert">
          <p>
            Could not load the gallery right now. Try again later.
          </p>
        </div>
      )}
      {phase === "ready" && (
        <GalleryGrid images={images} onImageClick={setSelectedImage} />
      )}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </main>
  );
}
