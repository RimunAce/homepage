import SafeImage from "../../components/SafeImage";
import { Activity } from "../types";
import styles from "../anilist.module.css";

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className={styles.activityItem}>
      {activity.media && (
        <SafeImage
          src={activity.media.coverImage.large}
          alt=""
          width={48}
          height={64}
          sizes="48px"
          className={styles.activityImage}
          fallbackLabel="No cover"
        />
      )}
      <div className={styles.activityCopy}>
        <p className={styles.activityDescription}>
          {activity.status && <span className="font-bold">{activity.status}</span>}
          {activity.progress && ` ${activity.progress}`}
          {activity.media && (
            <>
              {" of "}
              <a href={activity.media.siteUrl} target="_blank" rel="noopener noreferrer" className={styles.activityMediaLink}>
                {activity.media.title.romaji}
              </a>
            </>
          )}
        </p>
        <p className={styles.activityDate}>{formatDate(activity.createdAt)}</p>
        <a
          href={`https://anilist.co/activity/${activity.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.activityLink}
        >
          View activity
        </a>
      </div>
    </article>
  );
}
