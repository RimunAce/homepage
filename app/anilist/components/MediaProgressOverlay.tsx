import { MediaItem } from "../types";
import { getProgressPercent, getProgressLabel } from "../utils/progressUtils";
import styles from "../anilist.module.css";

interface MediaProgressOverlayProps {
  item: MediaItem;
}

export function MediaProgressOverlay({ item }: MediaProgressOverlayProps) {
  return (
    <div className={styles.progressOverlay}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${getProgressPercent(item)}%` }} />
      </div>
      <p className={styles.progressLabel}>{getProgressLabel(item)}</p>
    </div>
  );
}
