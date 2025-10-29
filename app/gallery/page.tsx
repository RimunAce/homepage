"use client";

import { useState, useEffect, useMemo } from "react";
import Background from "@/app/components/Background";
import GalleryHeader from "./GalleryHeader";
import ScrollingBanner from "./ScrollingBanner";
import GalleryNav from "./GalleryNav";
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

  useEffect(() => {
    fetch(DATA_URLS.gallery)
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  // Extract all image URLs for preloading
  const imageUrls = useMemo(() => images.map((img) => img.url), [images]);

  // Preload all gallery images
  const preloadStatus = useImagePreloader(imageUrls);

  return (
    <div className="min-h-screen bg-retro-gray relative">
      <Background />
      <GalleryHeader />
      <ScrollingBanner />
      <GalleryNav />
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
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
        <GalleryGrid images={images} onImageClick={setSelectedImage} />
      </main>
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
