import { motion } from "framer-motion";
import Image from "next/image";

interface TrackDisplayProps {
  readonly currentTrack: number;
  readonly totalTracks: number;
  readonly title: string;
  readonly author: string;
  readonly authorUrl: string;
  readonly thumbnail: string;
  readonly trackId: string;
  readonly onThumbnailClick: () => void;
}

export default function TrackDisplay({
  currentTrack,
  totalTracks,
  title,
  author,
  authorUrl,
  thumbnail,
  trackId,
  onThumbnailClick,
}: TrackDisplayProps) {
  return (
    <motion.div
      key={currentTrack}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex items-center space-x-4">
        <div
          onClick={onThumbnailClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onThumbnailClick();
            }
          }}
          role={trackId === "science" ? "button" : "presentation"}
          tabIndex={trackId === "science" ? 0 : -1}
          className={`w-20 h-20 md:w-24 md:h-24 border-2 border-retro-black flex-shrink-0 ${
            trackId === "science"
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : ""
          }`}
          style={{ boxShadow: "4px 4px 0px #000000" }}
        >
          <Image
            src={thumbnail}
            alt={title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-bold truncate mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>by</span>
            <a
              href={authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-retro-black underline hover:bg-retro-black hover:text-retro-white px-1 transition-all"
            >
              {author}
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track {currentTrack + 1} of {totalTracks}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
