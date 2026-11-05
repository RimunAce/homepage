"use client";

import { useState, useEffect } from "react";
import GalleryGrid from "./GalleryGrid";
import ImageModal from "./ImageModal";
import { fetchGallery, type GalleryImage } from "@/app/lib/content";

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
      className="max-w-6xl mx-auto px-4 py-6 sm:py-8 pb-8 relative z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
    >
      <h1 className="retro-heading text-2xl mb-6">GALLERY</h1>
      {phase === "loading" && (
        <p className="retro-text text-sm mb-6" role="status">
          Loading photos.
        </p>
      )}
      {phase === "error" && (
        <div className="mb-6 bg-retro-yellow border-2 border-retro-black p-3">
          <p className="text-xs font-mono text-retro-black">
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
