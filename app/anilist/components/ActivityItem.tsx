import SafeImage from "../../components/SafeImage";
import { Activity } from "../types";

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
    <div className="flex items-start gap-3 p-3 bg-retro-gray border-2 border-retro-black hover:bg-retro-white transition-colors">
      {activity.media && (
        <SafeImage
          src={activity.media.coverImage.large}
          alt=""
          width={48}
          height={64}
          sizes="48px"
          className="w-12 h-16 object-cover border border-retro-black"
          fallbackLabel="No cover"
        />
      )}
      <div className="flex-grow">
        <p className="retro-text text-xs">
          {activity.status && <span className="font-bold">{activity.status}</span>}
          {activity.progress && ` ${activity.progress}`}
          {activity.media && (
            <>
              {" of "}
              <a href={activity.media.siteUrl} target="_blank" rel="noopener noreferrer" className="retro-link inline-flex min-h-11 items-center">
                {activity.media.title.romaji}
              </a>
            </>
          )}
        </p>
        <p className="text-xs opacity-70 mt-1">{formatDate(activity.createdAt)}</p>
        <a
          href={`https://anilist.co/activity/${activity.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs retro-link mt-1 inline-flex min-h-11 items-center"
        >
          View activity
        </a>
      </div>
    </div>
  );
}
