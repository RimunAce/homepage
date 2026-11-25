import { SkeletonCard } from "./SkeletonCard";
import styles from "../anilist.module.css";

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className={`retro-card ${styles.loadingProfile}`} role="status" aria-live="polite">
        <p className={styles.loadingText}>Loading AniList profile and lists.</p>
        <div className={styles.loadingPreview} aria-hidden="true">
          <div className={styles.loadingAvatar}></div>
          <div className={styles.loadingLines}>
            <div className={styles.loadingName}></div>
            <div className={styles.loadingAbout}></div>
          </div>
        </div>
      </div>
      <div className={`retro-card ${styles.loadingList}`} aria-hidden="true">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
