import Image from "next/image";

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

const RATIO_CONFIG = {
  wide: { threshold: 1.5, class: "col-span-2 row-span-1" },
  landscape: { threshold: 1.2, class: "col-span-2 row-span-2" },
  square: { threshold: 0.8, class: "col-span-1 row-span-1" },
  portrait: { threshold: 0.6, class: "col-span-1 row-span-2" },
  tall: { threshold: 0, class: "col-span-1 row-span-3" },
} as const;

const getGridClass = (width: number, height: number) => {
  const ratio = width / height;

  for (const [_, config] of Object.entries(RATIO_CONFIG)) {
    if (ratio > config.threshold) return config.class;
  }

  return "col-span-1 row-span-1";
};

export default function GalleryGrid({
  images,
  onImageClick,
}: GalleryGridProps) {
  const reversedImages = [...images].reverse();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[200px] gap-2 sm:gap-3">
      {reversedImages.map((image, index) => (
        <button
          key={`gallery-${image.url}-${index}`}
          className={`${getGridClass(
            image.width,
            image.height
          )} border-2 border-retro-black overflow-hidden cursor-pointer transition-all`}
          style={{ boxShadow: "3px 3px 0px #000000" }}
          onClick={() => onImageClick(image)}
        >
          <div className="relative w-full h-full">
            <Image
              src={image.url}
              alt={image.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
