import SafeImage from "../components/SafeImage";
import styles from "./gallery.module.css";

interface GalleryImage {
  url: string;
  width: number;
  height: number;
  caption?: string;
}

interface GalleryGridProps {
  readonly images: GalleryImage[];
  readonly onImageClick: (image: GalleryImage) => void;
}

const getGridClass = (width: number, height: number) => {
  const ratio = width / height;

  if (!Number.isFinite(ratio) || ratio <= 0) return "col-span-1 row-span-1";
  if (ratio >= 1.6) return "col-span-2 row-span-1";
  if (ratio >= 1.15) return "col-span-2 row-span-2";
  if (ratio >= 0.78) return "col-span-1 row-span-1";
  if (ratio >= 0.55) return "col-span-1 row-span-2";
  return "col-span-1 row-span-3";
};

export default function GalleryGrid({
  images,
  onImageClick,
}: GalleryGridProps) {
  const reversedImages = [...images].reverse();

  if (images.length === 0) {
    return (
      <div className={`${styles.empty} py-12 text-center`}>
        <p className="mb-2">No photos yet</p>
        <p className="text-sm">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {reversedImages.map((image, index) => (
        <button
          type="button"
          key={`gallery-${image.url}-${index}`}
          aria-label={image.caption || `Open photo ${index + 1}`}
          className={`${styles.photo} ${getGridClass(
            image.width,
            image.height
          )} min-w-0`}
          onClick={() => onImageClick(image)}
        >
          <div className="relative w-full h-full">
            <SafeImage
              src={image.url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 479px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={index < 2}
              fetchPriority={index === 0 ? "high" : undefined}
              fallbackLabel="Photo unavailable"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
