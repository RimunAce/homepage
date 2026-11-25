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
  readonly coverIsButton: boolean;
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
  coverIsButton,
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
        {coverIsButton && trackId === "science" ? (
          <button
            type="button"
            onClick={onThumbnailClick}
            aria-label={`Switch the cover for ${title}`}
            className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#090b10] p-0 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-24 md:w-24"
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
            className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#090b10] md:h-24 md:w-24"
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
                className="inline-flex min-h-11 items-center text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {author}
              </a>
            ) : (
              <span className="text-white">{author}</span>
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
