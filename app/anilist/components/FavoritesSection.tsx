import { MediaItem } from "../types";
import { MediaCard } from "./MediaCard";
import styles from "../anilist.module.css";

interface FavoritesSectionProps {
  favorites: MediaItem[];
}

export function FavoritesSection({ favorites }: FavoritesSectionProps) {
  if (favorites.length === 0) return null;

  return (
    <section className={styles.favorites} aria-labelledby="anilist-favorites-heading">
      <h2 id="anilist-favorites-heading" className={styles.sectionHeading}>Favorites (8+ score)</h2>
      <div className={styles.favoritesGrid}>
        {favorites.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
