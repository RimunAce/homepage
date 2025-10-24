"use client";

import { useState, useEffect } from "react";
import Background from "@/app/components/Background";
import GalleryHeader from "./GalleryHeader";
import ScrollingBanner from "./ScrollingBanner";
import GalleryNav from "./GalleryNav";
import GalleryGrid from "./GalleryGrid";
import ImageModal from "./ImageModal";
import { DATA_URLS } from "@/app/lib/dataUrls";

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

  return (
    <div className="min-h-screen bg-retro-gray relative">
      <Background />
      <GalleryHeader />
      <ScrollingBanner />
      <GalleryNav />
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <GalleryGrid images={images} onImageClick={setSelectedImage} />
      </main>
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
