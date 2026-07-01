import Image from "next/image";
import { Activity } from "../page";

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
        <Image
          src={activity.media.coverImage.large}
          alt={activity.media.title.romaji}
          width={48}
          height={64}
          className="w-12 h-16 object-cover border border-retro-black"
        />
      )}
      <div className="flex-grow">
        <p className="retro-text text-xs">
          {activity.status && <span className="font-bold">{activity.status}</span>}
          {activity.progress && ` ${activity.progress}`}
          {activity.media && (
            <>
              {" of "}
              <a href={activity.media.siteUrl} target="_blank" rel="noopener noreferrer" className="retro-link">
                {activity.media.title.romaji}
              </a>
            </>
          )}
        </p>
        <p className="text-xs text-gray-600 mt-1">{formatDate(activity.createdAt)}</p>
        <a
          href={`https://anilist.co/activity/${activity.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 mt-1 inline-block hover:underline"
        >
          View activity →
        </a>
      </div>
    </div>
  );
}
