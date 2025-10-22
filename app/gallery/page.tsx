"use client";

import { useState, useEffect } from "react";
import Background from "../components/Background";
import GalleryHeader from "./GalleryHeader";
import ScrollingBanner from "./ScrollingBanner";
import GalleryNav from "./GalleryNav";
import GalleryGrid from "./GalleryGrid";
import ImageModal from "./ImageModal";

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
    fetch("/data/gallery.json")
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
