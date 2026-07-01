import Image from "next/image";
import { MediaItem } from "../types";
import { MediaProgressOverlay } from "./MediaProgressOverlay";

interface MediaCardProps {
  item: MediaItem;
}

function getDisplayTitle(item: MediaItem) {
  return item.title.english || item.title.romaji;
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
        <p className="retro-text text-xs font-bold truncate group-hover:text-blue-600">{getDisplayTitle(item)}</p>
        {item.mediaListEntry && (
          <div className="text-xs mt-1">
            <p className="text-gray-600">{item.mediaListEntry.status}</p>
            {item.mediaListEntry.score > 0 && <p className="text-gray-600">⭐ {item.mediaListEntry.score}/10</p>}
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
