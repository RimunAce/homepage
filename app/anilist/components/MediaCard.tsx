import SafeImage from "../../components/SafeImage";
import { MediaItem } from "../types";
import { MediaProgressOverlay } from "./MediaProgressOverlay";
import styles from "../anilist.module.css";

interface MediaCardProps {
  item: MediaItem;
  priority?: boolean;
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

export function MediaCard({ item, priority = false }: MediaCardProps) {
  return (
    <a 
      href={item.siteUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.mediaCard}
      aria-label={`View ${getDisplayTitle(item)} on AniList`}
    >
      <div className={styles.mediaCover}>
        <SafeImage
          src={item.coverImage.large}
          alt=""
          width={300}
          height={450}
          sizes="(max-width: 640px) 45vw, 180px"
          priority={priority}
          className="h-full w-full object-cover"
          fallbackLabel="No cover"
        />
        {item.mediaListEntry?.status === "CURRENT" && <MediaProgressOverlay item={item} />}
      </div>
      <div className={styles.mediaCardCopy}>
        <p className={styles.mediaTitle}>{getDisplayTitle(item)}</p>
        {item.mediaListEntry && (
          <div className={styles.mediaMeta}>
            <p>{item.mediaListEntry.status}</p>
            {item.mediaListEntry.score > 0 && (
              <p className="flex items-center gap-1">
                <StarIcon /> {item.mediaListEntry.score}/10
              </p>
            )}
          </div>
        )}
        {item.genres?.slice(0, 2).map((genre) => (
          <span key={genre} className={styles.genre}>
            {genre}
          </span>
        ))}
      </div>
    </a>
  );
}
