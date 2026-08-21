"use client";

import { useState, useEffect, useMemo } from "react";
import GalleryGrid from "./GalleryGrid";
import ImageModal from "./ImageModal";
import { DATA_URLS } from "@/app/lib/dataUrls";
import { useImagePreloader } from "@/app/contexts/useImagePreloader";

interface GalleryImage {
  url: string;
  width: number;
  height: number;
  caption?: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(DATA_URLS.gallery)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch gallery");
        return res.json();
      })
      .then((data) => {
        setImages(data);
        setError(null);
      })
      .catch(() => setError("Could not load the gallery right now. Please try again later."));
  }, []);

  // Extract all image URLs for preloading
  const imageUrls = useMemo(
    () => images.map((img) => img.url),
    [images]
  );

  // Preload all gallery images
  const preloadStatus = useImagePreloader(imageUrls);

  return (
    <main id="main-content" tabIndex={-1} className="max-w-6xl mx-auto px-4 py-8 pb-36 relative z-10 focus:outline-none">
      <h1 className="retro-heading text-2xl mb-6">GALLERY</h1>
      {/* Loading indicator */}
      {!preloadStatus.isComplete && images.length > 0 && (
        <div className="mb-6 p-4 bg-retro-black border-2 border-retro-white text-retro-white font-mono text-sm"
             style={{ boxShadow: "4px 4px 0px #000000" }}>
          <div className="flex items-center justify-between mb-2">
            <span>LOADING IMAGES...</span>
            <span>{preloadStatus.loaded} / {preloadStatus.total}</span>
          </div>
          <div className="w-full bg-retro-gray border-2 border-retro-white h-4">
            <div 
              className="bg-retro-white h-full transition-all duration-300"
              style={{ width: `${(preloadStatus.loaded / preloadStatus.total) * 100}%` }}
            />
          </div>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-retro-yellow border-2 border-retro-black p-3">
          <p className="text-xs font-mono text-retro-black">{error}</p>
        </div>
      )}
      <GalleryGrid images={images} onImageClick={setSelectedImage} />
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </main>
  );
}
