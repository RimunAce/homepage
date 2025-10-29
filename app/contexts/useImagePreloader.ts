import { useState, useEffect } from "react";

interface PreloadStatus {
  loaded: number;
  total: number;
  isComplete: boolean;
}

export function useImagePreloader(imageUrls: string[]) {
  const [status, setStatus] = useState<PreloadStatus>({
    loaded: 0,
    total: imageUrls.length,
    isComplete: false,
  });

  useEffect(() => {
    if (imageUrls.length === 0) {
      setStatus({ loaded: 0, total: 0, isComplete: true });
      return;
    }

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const updateStatus = () => {
      loadedCount++;
      setStatus({
        loaded: loadedCount,
        total: imageUrls.length,
        isComplete: loadedCount === imageUrls.length,
      });
    };

    imageUrls.forEach((url) => {
      const img = new Image();
      img.onload = updateStatus;
      img.onerror = updateStatus; // Count errors as loaded to prevent infinite waiting
      img.src = url;
      images.push(img);
    });

    // Cleanup function
    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [imageUrls]);

  return status;
}
