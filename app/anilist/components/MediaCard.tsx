import Image from "next/image";
import { MediaItem } from "../types";
import { MediaProgressOverlay } from "./MediaProgressOverlay";

interface MediaCardProps {
  item: MediaItem;
}

function getDisplayTitle(item: MediaItem) {
  return item.title.english || item.title.romaji;
}

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="inline-block"
    >
      <path d="M12 2l2.9 6.26 6.6.56-5 4.36 1.5 6.45L12 16.9 5.99 19.63l1.5-6.45-5-4.36 6.6-.56L12 2z" />
    </svg>
  );
}

export function MediaCard({ item }: MediaCardProps) {
  return (
    <a 
      href={item.siteUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group cursor-pointer"
      aria-label={`View ${getDisplayTitle(item)} on AniList`}
    >
      <div className="relative w-full aspect-[2/3] border-2 border-retro-black overflow-hidden">
        <Image
          src={item.coverImage.large}
          alt={item.title.romaji}
          width={300}
          height={450}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {item.mediaListEntry?.status === "CURRENT" && <MediaProgressOverlay item={item} />}
      </div>
      <div className="mt-2">
        <p className="retro-text text-xs font-bold truncate group-hover:underline">{getDisplayTitle(item)}</p>
        {item.mediaListEntry && (
          <div className="text-xs mt-1 opacity-70">
            <p>{item.mediaListEntry.status}</p>
            {item.mediaListEntry.score > 0 && (
              <p className="flex items-center gap-1">
                <StarIcon /> {item.mediaListEntry.score}/10
              </p>
            )}
          </div>
        )}
        {item.genres?.slice(0, 2).map((genre) => (
          <span key={genre} className="text-xs bg-retro-gray border border-retro-black px-1 mr-1">
            {genre}
          </span>
        ))}
      </div>
    </a>
  );
}
