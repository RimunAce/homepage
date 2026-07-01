import { MediaItem } from "../page";
import { MediaCard } from "./MediaCard";

interface FavoritesSectionProps {
  favorites: MediaItem[];
}

export function FavoritesSection({ favorites }: FavoritesSectionProps) {
  if (favorites.length === 0) return null;

  return (
    <div className="retro-card">
      <h3 className="retro-heading mb-4">⭐ FAVORITES (8+ SCORE)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {favorites.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
