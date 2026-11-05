import { motion } from "framer-motion";
import SafeImage from "../SafeImage";

interface TrackDisplayProps {
  readonly currentTrack: number;
  readonly totalTracks: number;
  readonly title: string;
  readonly author: string;
  readonly authorUrl: string | undefined;
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
        {trackId === "science" ? (
          <button
            type="button"
            onClick={onThumbnailClick}
            aria-label={`Switch the cover for ${title}`}
            className="w-20 h-20 md:w-24 md:h-24 border-2 border-retro-black flex-shrink-0 overflow-hidden p-0 hover:opacity-80"
            style={{ boxShadow: "4px 4px 0px #000000" }}
          >
            <SafeImage
              src={thumbnail}
              alt=""
              width={96}
              height={96}
              sizes="96px"
              className="w-full h-full object-cover"
              fallbackLabel="No cover"
            />
          </button>
        ) : (
          <div
            className="w-20 h-20 md:w-24 md:h-24 border-2 border-retro-black flex-shrink-0 overflow-hidden"
            style={{ boxShadow: "4px 4px 0px #000000" }}
          >
            <SafeImage
              src={thumbnail}
              alt={title}
              width={96}
              height={96}
              sizes="96px"
              className="w-full h-full object-cover"
              fallbackLabel="No cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-bold truncate mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm opacity-70">
            <span>by</span>
            {authorUrl ? (
              <a
                href={authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-retro-black underline hover:bg-retro-black hover:text-retro-white px-1 transition-all"
              >
                {author}
              </a>
            ) : (
              <span className="text-retro-black">{author}</span>
            )}
          </div>
          <p className="text-xs opacity-60 mt-1">
            Track {currentTrack + 1} of {totalTracks}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
