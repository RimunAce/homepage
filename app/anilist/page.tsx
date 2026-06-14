"use client";

import { useState, useEffect, useMemo, useCallback, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import Background from "../components/Background";
import DOMPurify from "dompurify";

interface AniListUser {
  id: number;
  name: string;
  about: string | null;
  avatar: {
    large: string;
    medium: string;
  };
  bannerImage: string | null;
  statistics: {
    anime: {
      count: number;
      episodesWatched: number;
      meanScore: number;
    };
    manga: {
      count: number;
      chaptersRead: number;
      meanScore: number;
    };
  };
}

interface Activity {
  id: number;
  type: string;
  createdAt: number;
  status?: string;
  progress?: string;
  media?: {
    id: number;
    title: {
      romaji: string;
    };
    coverImage: {
      large: string;
    };
    siteUrl: string;
  };
}

interface MediaItem {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    large: string;
  };
  siteUrl: string;
  genres: string[];
  episodes?: number;
  chapters?: number;
  status: string;
  score: number | null;
  progress: number;
  mediaListEntry?: {
    status: string;
    score: number;
    progress: number;
  };
}

interface MediaListEntry {
  media: Omit<MediaItem, "mediaListEntry">;
  status: string;
  score: number;
  progress: number;
}

interface AniListCache {
  data: {
    user: AniListUser;
    activities: Activity[];
    animeList: MediaItem[];
    mangaList: MediaItem[];
  };
  timestamp: number;
}

interface UserResponse {
  User: AniListUser;
}

interface ActivitiesResponse {
  Page: {
    activities: Activity[];
  };
}

interface MediaListResponse {
  MediaListCollection: {
    lists: {
      entries: MediaListEntry[];
    }[];
  };
}

interface AniListGraphQLError {
  message?: string;
}

interface AniListGraphQLResponse<T> {
  data: T;
  errors?: AniListGraphQLError[];
}

interface MediaListFilters {
  statusFilter: MediaStatus;
  genreFilter: string;
  searchQuery: string;
  sortOrder: SortOrder;
}

type MediaStatus = "ALL" | "CURRENT" | "COMPLETED" | "PAUSED" | "DROPPED" | "PLANNING" | "REPEATING";
type SortOrder = "TITLE_ASC" | "TITLE_DESC" | "SCORE_ASC" | "SCORE_DESC" | "NONE";
type ViewMode = "grid" | "list";

const CACHE_KEY = "anilist_data_cache";
const CACHE_DURATION = 5 * 60 * 1000;
const PAGE_SIZE = 10;
const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";
const ANILIST_USER_NAME = "Reuzin";

const USER_PROFILE_QUERY = `
  query ($userName: String) {
    User(name: $userName) {
      id
      name
      about
      avatar {
        large
        medium
      }
      bannerImage
      statistics {
        anime {
          count
          episodesWatched
          meanScore
        }
        manga {
          count
          chaptersRead
          meanScore
        }
      }
    }
  }
`;

const ACTIVITIES_QUERY = `
  query ($userId: Int, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      activities(userId: $userId, sort: ID_DESC) {
        ... on ListActivity {
          id
          type
          status
          progress
          createdAt
          media {
            id
            title {
              romaji
            }
            coverImage {
              large
            }
            siteUrl
          }
        }
      }
    }
  }
`;

const MEDIA_LIST_QUERY = `
  query ($userName: String, $type: MediaType) {
    MediaListCollection(userName: $userName, type: $type) {
      lists {
        entries {
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            siteUrl
            genres
            episodes
            chapters
          }
          status
          score
          progress
        }
      }
    }
  }
`;

const fetchAniListGraphQL = async <T,>(query: string, variables: Record<string, unknown>) => {
  const response = await fetch(ANILIST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data: AniListGraphQLResponse<T> = await response.json();
  if (data.errors?.length) {
    throw new Error(data.errors[0].message || "AniList request failed");
  }

  return data.data;
};

const fetchUserProfile = async () => {
  const data = await fetchAniListGraphQL<UserResponse>(USER_PROFILE_QUERY, {
    userName: ANILIST_USER_NAME,
  });

  if (!data.User) {
    throw new Error("AniList user not found");
  }

  return data.User;
};

const fetchActivitiesWithUserId = async (userId: number) => {
  const data = await fetchAniListGraphQL<ActivitiesResponse>(ACTIVITIES_QUERY, {
    userId,
    page: 1,
    perPage: 10,
  });

  return data.Page.activities;
};

const fetchMediaList = async (type: "ANIME" | "MANGA") => {
  const data = await fetchAniListGraphQL<MediaListResponse>(MEDIA_LIST_QUERY, {
    userName: ANILIST_USER_NAME,
    type,
  });

  return data.MediaListCollection.lists.flatMap((list) =>
    list.entries.map((entry) => ({
      ...entry.media,
      mediaListEntry: {
        status: entry.status,
        score: entry.score,
        progress: entry.progress,
      },
    }))
  );
};

const readCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as AniListCache;
    if (Date.now() - parsed.timestamp >= CACHE_DURATION) return null;

    return parsed.data;
  } catch (e) {
    console.error("Cache parse error:", e);
    return null;
  }
};

const getAboutPreview = (about: string | null | undefined) => {
  if (!about) return null;

  const plain = DOMPurify.sanitize(about, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return plain.length > 200 ? `${plain.slice(0, 200)}...` : plain;
};

const getActiveItems = (
  activeTab: "anime" | "manga",
  animeList: MediaItem[],
  mangaList: MediaItem[]
) => (activeTab === "anime" ? animeList : mangaList);

const getMediaLabel = (activeTab: "anime" | "manga") => (activeTab === "anime" ? "anime" : "manga");

const getDisplayTitle = (item: MediaItem) => item.title.english || item.title.romaji;

const getMediaProgressTotal = (item: MediaItem) => item.episodes || item.chapters || 100;

const getMediaScore = (item: MediaItem) => item.mediaListEntry?.score || 0;

const getGenres = (items: MediaItem[]) => {
  const genres = new Set<string>();
  items.forEach((item) => {
    item.genres?.forEach((genre) => genres.add(genre));
  });
  return Array.from(genres).sort();
};

const getFavorites = (items: MediaItem[]) =>
  items
    .filter((item) => getMediaScore(item) >= 8)
    .sort((a, b) => getMediaScore(b) - getMediaScore(a))
    .slice(0, 5);

const matchesStatus = (item: MediaItem, statusFilter: MediaStatus) =>
  statusFilter === "ALL" || item.mediaListEntry?.status === statusFilter;

const matchesGenre = (item: MediaItem, genreFilter: string) =>
  genreFilter === "ALL" || item.genres?.includes(genreFilter);

const matchesSearch = (item: MediaItem, searchQuery: string) => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return true;

  return (
    item.title.romaji.toLowerCase().includes(query) ||
    (item.title.english?.toLowerCase().includes(query) ?? false)
  );
};

const sortMediaItems = (items: MediaItem[], sortOrder: SortOrder) => {
  const sorted = [...items];

  switch (sortOrder) {
    case "TITLE_ASC":
      sorted.sort((a, b) => getDisplayTitle(a).localeCompare(getDisplayTitle(b)));
      break;
    case "TITLE_DESC":
      sorted.sort((a, b) => getDisplayTitle(b).localeCompare(getDisplayTitle(a)));
      break;
    case "SCORE_ASC":
      sorted.sort((a, b) => getMediaScore(a) - getMediaScore(b));
      break;
    case "SCORE_DESC":
      sorted.sort((a, b) => getMediaScore(b) - getMediaScore(a));
      break;
  }

  return sorted;
};

const getFilteredAndSortedItems = (items: MediaItem[], filters: MediaListFilters) => {
  const filtered = items.filter(
    (item) =>
      matchesStatus(item, filters.statusFilter) &&
      matchesGenre(item, filters.genreFilter) &&
      matchesSearch(item, filters.searchQuery)
  );

  return sortMediaItems(filtered, filters.sortOrder);
};

const getPageItems = (items: MediaItem[], currentPage: number) => {
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  return items.slice(startIndex, endIndex);
};

const getTotalPages = (items: MediaItem[]) => Math.ceil(items.length / PAGE_SIZE);

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="w-full aspect-[2/3] bg-retro-gray border-2 border-retro-black"></div>
    <div className="mt-2 space-y-2">
      <div className="h-3 bg-retro-gray border border-retro-black"></div>
      <div className="h-2 bg-retro-gray border border-retro-black w-2/3"></div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="space-y-6">
    <div className="retro-card animate-pulse">
      <div className="flex gap-6">
        <div className="w-32 h-32 bg-retro-gray border-2 border-retro-black"></div>
        <div className="flex-grow space-y-3">
          <div className="h-6 bg-retro-gray border-2 border-retro-black w-1/3"></div>
          <div className="h-20 bg-retro-gray border-2 border-retro-black"></div>
        </div>
      </div>
    </div>
    <div className="retro-card">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-red-100 border-2 border-red-500 p-4 mb-4">
    <p className="text-red-700 retro-text">Error: {message}</p>
    <button className="retro-button mt-2 text-sm" onClick={onRetry}>
      Retry
    </button>
  </div>
);

const SiteHeader = () => (
  <header className="bg-retro-black text-retro-white py-2 px-4 relative z-10">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <h1 className="text-lg font-bold">MY ANILIST</h1>
      <span className="text-sm">KASANE</span>
    </div>
  </header>
);

const ScrollingBanner = () => (
  <div className="bg-retro-black text-retro-white py-1 overflow-hidden relative z-10">
    <div className="scroll-banner flex whitespace-nowrap text-xs font-mono">
      <span className="scroll-content">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={`banner-${i}`} className="mx-4">
            WE ARE NOT FINISHED //
          </span>
        ))}
      </span>
      <span className="scroll-content" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={`banner-dup-${i}`} className="mx-4">
            WE ARE NOT FINISHED //
          </span>
        ))}
      </span>
    </div>
    <style jsx>{`
      .scroll-banner {
        animation: scroll 30s linear infinite;
        will-change: transform;
      }
      .scroll-content {
        display: inline-block;
      }
      @keyframes scroll {
        from {
          transform: translateX(0) translateZ(0);
        }
        to {
          transform: translateX(-50%) translateZ(0);
        }
      }
    `}</style>
  </div>
);

const SiteNav = () => (
  <nav className="bg-retro-white border-b-2 border-retro-black relative z-10">
    <div className="max-w-6xl mx-auto px-4 py-2">
      <div className="flex flex-wrap gap-2">
        <Link href="/" className="retro-button text-sm active:scale-95 transition-transform">
          HOME
        </Link>
        <Link href="/gallery" className="retro-button text-sm active:scale-95 transition-transform">
          GALLERY
        </Link>
        <Link href="/anilist" className="retro-button text-sm active:scale-95 transition-transform">
          MY ANILIST
        </Link>
        <Link href="/music" className="retro-button text-sm active:scale-95 transition-transform">
          MUSIC PLAYER
        </Link>
      </div>
    </div>
  </nav>
);

interface StatBlockProps {
  title: string;
  totalLabel: string;
  total: number;
  detailLabel: string;
  detail: number;
  meanScore: number;
}

const StatBlock = ({ title, totalLabel, total, detailLabel, detail, meanScore }: StatBlockProps) => (
  <div className="p-4 bg-retro-gray border-2 border-retro-black">
    <h3 className="retro-heading text-sm mb-3">{title}</h3>
    <div className="space-y-1 retro-text text-xs">
      <div className="flex justify-between">
        <span>{totalLabel}</span>
        <span className="font-bold">{total}</span>
      </div>
      <div className="flex justify-between">
        <span>{detailLabel}</span>
        <span className="font-bold">{detail}</span>
      </div>
      <div className="flex justify-between">
        <span>Mean Score:</span>
        <span className="font-bold">{meanScore || "N/A"}</span>
      </div>
    </div>
  </div>
);

interface ProfileSectionProps {
  user: AniListUser;
  aboutPreview: string | null;
}

const ProfileSection = ({ user, aboutPreview }: ProfileSectionProps) => (
  <div className="retro-card">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <Image
          src={user.avatar.large}
          alt={`${user.name}'s avatar`}
          width={128}
          height={128}
          className="w-32 h-32 border-2 border-retro-black"
          style={{ boxShadow: "2px 2px 0px #000000" }}
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        {aboutPreview && (
          <div className="retro-text mb-4 p-3 bg-retro-gray border-2 border-retro-black max-h-32 overflow-y-auto">
            {aboutPreview}
          </div>
        )}
        <a
          href={`https://anilist.co/user/${user.name}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="retro-button inline-block text-sm"
        >
          Visit AniList Profile →
        </a>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <StatBlock
        title="ANIME STATS"
        totalLabel="Total:"
        total={user.statistics.anime.count}
        detailLabel="Episodes:"
        detail={user.statistics.anime.episodesWatched}
        meanScore={user.statistics.anime.meanScore}
      />
      <StatBlock
        title="MANGA STATS"
        totalLabel="Total:"
        total={user.statistics.manga.count}
        detailLabel="Chapters:"
        detail={user.statistics.manga.chaptersRead}
        meanScore={user.statistics.manga.meanScore}
      />
    </div>
  </div>
);

interface FavoritesSectionProps {
  favorites: MediaItem[];
  activeTab: "anime" | "manga";
}

const FavoritesSection = ({ favorites, activeTab }: FavoritesSectionProps) => (
  <div className="retro-card">
    <h3 className="retro-heading mb-4">{getMediaLabel(activeTab).toUpperCase()} FAVORITES (8+ SCORE)</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {favorites.map((item) => (
        <a
          key={item.id}
          href={item.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-pointer"
        >
          <div className="relative w-full aspect-[2/3] border-2 border-retro-black overflow-hidden">
            <Image
              src={item.coverImage.large}
              alt={item.title.romaji}
              width={300}
              height={450}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-retro-black px-2 py-1 text-xs font-bold">
              {item.mediaListEntry?.score}
            </div>
          </div>
          <p className="retro-text text-xs font-bold truncate mt-2 group-hover:text-blue-600">
            {getDisplayTitle(item)}
          </p>
        </a>
      ))}
    </div>
  </div>
);

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities = ({ activities }: RecentActivitiesProps) => (
  <div className="retro-card">
    <h3 className="retro-heading mb-4">RECENT ACTIVITIES</h3>
    <div className="space-y-3">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-retro-gray border-2 border-retro-black hover:bg-retro-white transition-colors"
          >
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
                <span className="font-bold">{activity.status}</span>
                {activity.progress && ` ${activity.progress}`}
                {activity.media && (
                  <>
                    {" of "}
                    <a
                      href={activity.media.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="retro-link"
                    >
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
        ))
      ) : (
        <p className="retro-text text-center py-4">No recent activities</p>
      )}
    </div>
  </div>
);

interface MediaListControlsProps {
  activeTab: "anime" | "manga";
  setActiveTab: (tab: "anime" | "manga") => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: MediaStatus;
  setStatusFilter: (filter: MediaStatus) => void;
  genreFilter: string;
  setGenreFilter: (filter: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  allGenres: string[];
}

const MediaListControls = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  genreFilter,
  setGenreFilter,
  sortOrder,
  setSortOrder,
  allGenres,
}: MediaListControlsProps) => (
  <>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div className="flex gap-2">
        <button
          className={`retro-button text-sm ${activeTab === "anime" ? "bg-retro-black text-retro-white" : ""}`}
          onClick={() => setActiveTab("anime")}
        >
          📺 ANIME LIST
        </button>
        <button
          className={`retro-button text-sm ${activeTab === "manga" ? "bg-retro-black text-retro-white" : ""}`}
          onClick={() => setActiveTab("manga")}
        >
          📖 MANGA LIST
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className={`retro-button text-sm ${viewMode === "grid" ? "bg-retro-black text-retro-white" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          ▦ GRID
        </button>
        <button
          className={`retro-button text-sm ${viewMode === "list" ? "bg-retro-black text-retro-white" : ""}`}
          onClick={() => setViewMode("list")}
        >
          ☰ LIST
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
      <div>
        <input
          type="text"
          placeholder="Search titles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="retro-input w-full text-xs"
        />
      </div>
      <div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as MediaStatus)}
          className="retro-input w-full text-xs"
        >
          <option value="ALL">All Status</option>
          <option value="CURRENT">Current</option>
          <option value="COMPLETED">Completed</option>
          <option value="PAUSED">Paused</option>
          <option value="DROPPED">Dropped</option>
          <option value="PLANNING">Planning</option>
          <option value="REPEATING">Repeating</option>
        </select>
      </div>
      <div>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="retro-input w-full text-xs"
        >
          <option value="ALL">All Genres</option>
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="retro-input w-full text-xs"
        >
          <option value="NONE">Default Order</option>
          <option value="TITLE_ASC">Title (A-Z)</option>
          <option value="TITLE_DESC">Title (Z-A)</option>
          <option value="SCORE_ASC">Score (Low-High)</option>
          <option value="SCORE_DESC">Score (High-Low)</option>
        </select>
      </div>
    </div>
  </>
);

const MediaListSummary = ({ activeTab, count }: { activeTab: "anime" | "manga"; count: number }) => (
  <p className="text-xs text-gray-600 mb-3">
    Showing {count} {getMediaLabel(activeTab)}
  </p>
);

const MediaProgressOverlay = ({ item }: { item: MediaItem }) => {
  if (item.mediaListEntry?.status !== "CURRENT") return null;

  const progress = item.mediaListEntry.progress || 0;
  const total = getMediaProgressTotal(item);
  const percent = Math.min(100, (progress / total) * 100);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-retro-black bg-opacity-90 p-1">
      <div className="h-2 bg-retro-gray border border-retro-white">
        <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-white text-xs text-center mt-1">
        {progress} / {total}
      </p>
    </div>
  );
};

const MediaListMeta = ({ item }: { item: MediaItem }) => {
  if (!item.mediaListEntry) return null;

  return (
    <div className="text-xs mt-1">
      <p className="text-gray-600">{item.mediaListEntry.status}</p>
      {item.mediaListEntry.score > 0 && (
        <p className="text-gray-600">⭐ {item.mediaListEntry.score}/10</p>
      )}
    </div>
  );
};

interface MediaGenresProps {
  item: MediaItem;
  max: number;
  className: string;
  spanClassName: string;
}

const MediaGenres = ({ item, max, className, spanClassName }: MediaGenresProps) => {
  if (!item.genres?.length) return null;

  return (
    <div className={className}>
      {item.genres.slice(0, max).map((genre) => (
        <span key={genre} className={spanClassName}>
          {genre}
        </span>
      ))}
    </div>
  );
};

const MediaGridItem = ({ item }: { item: MediaItem }) => (
  <a
    href={item.siteUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group cursor-pointer"
  >
    <div className="relative w-full aspect-[2/3] border-2 border-retro-black overflow-hidden">
      <Image
        src={item.coverImage.large}
        alt={item.title.romaji}
        width={300}
        height={450}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <MediaProgressOverlay item={item} />
    </div>
    <div className="mt-2">
      <p className="retro-text text-xs font-bold truncate group-hover:text-blue-600">
        {getDisplayTitle(item)}
      </p>
      <MediaListMeta item={item} />
      <MediaGenres
        item={item}
        max={2}
        className="flex flex-wrap gap-1 mt-1"
        spanClassName="text-xs bg-retro-gray border border-retro-black px-1"
      />
    </div>
  </a>
);

const MediaGrid = ({ items }: { items: MediaItem[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
    {items.map((item) => (
      <MediaGridItem key={item.id} item={item} />
    ))}
  </div>
);

const MediaScore = ({ item }: { item: MediaItem }) => {
  if (!item.mediaListEntry || item.mediaListEntry.score <= 0) return null;

  return (
    <div className="text-right">
      <div className="text-2xl font-bold">⭐</div>
      <div className="text-sm font-bold">{item.mediaListEntry.score}/10</div>
    </div>
  );
};

const MediaListItem = ({ item }: { item: MediaItem }) => (
  <a
    href={item.siteUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-3 bg-retro-gray border-2 border-retro-black hover:bg-retro-white transition-colors"
  >
    <Image
      src={item.coverImage.large}
      alt={item.title.romaji}
      width={64}
      height={96}
      className="w-16 h-24 object-cover border border-retro-black"
    />
    <div className="flex-grow">
      <p className="retro-text text-sm font-bold">{getDisplayTitle(item)}</p>
      <p className="text-xs text-gray-600 mt-1">
        {item.mediaListEntry?.status}
        {item.mediaListEntry?.status === "CURRENT" &&
          ` • ${item.mediaListEntry.progress} / ${getMediaProgressTotal(item)}`}
      </p>
      <MediaGenres
        item={item}
        max={4}
        className="flex flex-wrap gap-1 mt-2"
        spanClassName="text-xs bg-retro-white border border-retro-black px-2 py-1"
      />
    </div>
    <MediaScore item={item} />
  </a>
);

const MediaList = ({ items }: { items: MediaItem[] }) => (
  <div className="space-y-2">
    {items.map((item) => (
      <MediaListItem key={item.id} item={item} />
    ))}
  </div>
);

const EmptyState = ({ activeTab }: { activeTab: "anime" | "manga" }) => (
  <p className="retro-text text-center py-8">
    No {getMediaLabel(activeTab)} found with current filters
  </p>
);

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        className="retro-button text-sm"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        ← PREV
      </button>
      <span className="retro-button text-sm">
        {currentPage} / {totalPages}
      </span>
      <button
        className="retro-button text-sm"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        NEXT →
      </button>
    </div>
  );
};

interface MediaListSectionProps extends MediaListControlsProps {
  filteredAndSortedItems: MediaItem[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const MediaListSection = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  genreFilter,
  setGenreFilter,
  sortOrder,
  setSortOrder,
  allGenres,
  filteredAndSortedItems,
  currentPage,
  setCurrentPage,
  totalPages,
}: MediaListSectionProps) => {
  const pageItems = useMemo(
    () => getPageItems(filteredAndSortedItems, currentPage),
    [filteredAndSortedItems, currentPage]
  );

  return (
    <div className="retro-card">
      <MediaListControls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        allGenres={allGenres}
      />
      <MediaListSummary activeTab={activeTab} count={filteredAndSortedItems.length} />
      {filteredAndSortedItems.length === 0 ? (
        <EmptyState activeTab={activeTab} />
      ) : viewMode === "grid" ? (
        <MediaGrid items={pageItems} />
      ) : (
        <MediaList items={pageItems} />
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

interface AniListPageContentProps {
  user: AniListUser | null;
  aboutPreview: string | null;
  activities: Activity[];
  favorites: MediaItem[];
  activeTab: "anime" | "manga";
  setActiveTab: (tab: "anime" | "manga") => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: MediaStatus;
  setStatusFilter: (filter: MediaStatus) => void;
  genreFilter: string;
  setGenreFilter: (filter: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  allGenres: string[];
  filteredAndSortedItems: MediaItem[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchAniListData: () => Promise<void>;
}

const AniListPageContent = ({
  user,
  aboutPreview,
  activities,
  favorites,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  genreFilter,
  setGenreFilter,
  sortOrder,
  setSortOrder,
  allGenres,
  filteredAndSortedItems,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
  error,
  fetchAniListData,
}: AniListPageContentProps) => (
  <div className="min-h-screen bg-retro-gray relative">
    <Background />
    <SiteHeader />
    <ScrollingBanner />
    <SiteNav />

    <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
      {loading && <LoadingState />}

      {error && <ErrorState message={error} onRetry={fetchAniListData} />}

      {user && !loading && (
        <div className="space-y-6">
          <ProfileSection user={user} aboutPreview={aboutPreview} />
          {favorites.length > 0 && <FavoritesSection favorites={favorites} activeTab={activeTab} />}
          <RecentActivities activities={activities} />
          <MediaListSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            allGenres={allGenres}
            filteredAndSortedItems={filteredAndSortedItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </main>
  </div>
);

export default function AniListPage() {
  const [user, setUser] = useState<AniListUser | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [animeList, setAnimeList] = useState<MediaItem[]>([]);
  const [mangaList, setMangaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"anime" | "manga">("anime");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MediaStatus>("ALL");
  const [genreFilter, setGenreFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("NONE");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const aboutPreview = useMemo(() => getAboutPreview(user?.about), [user?.about]);

  const fetchAniListData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await fetchUserProfile();
      setUser(userData);

      const [activitiesData, animeData, mangaData] = await Promise.all([
        fetchActivitiesWithUserId(userData.id),
        fetchMediaList("ANIME"),
        fetchMediaList("MANGA"),
      ]);

      setActivities(activitiesData);
      setAnimeList(animeData);
      setMangaList(mangaData);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: {
            user: userData,
            activities: activitiesData,
            animeList: animeData,
            mangaList: mangaData,
          },
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch AniList data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDataWithCache = useCallback(async () => {
    const cachedData = readCachedData();
    if (cachedData) {
      setUser(cachedData.user);
      setActivities(cachedData.activities);
      setAnimeList(cachedData.animeList);
      setMangaList(cachedData.mangaList);
      return;
    }

    await fetchAniListData();
  }, [fetchAniListData]);

  useEffect(() => {
    loadDataWithCache();
  }, [loadDataWithCache]);

  const activeItems = getActiveItems(activeTab, animeList, mangaList);

  const allGenres = useMemo(() => getGenres(activeItems), [activeItems]);

  const favorites = useMemo(() => getFavorites(activeItems), [activeItems]);

  const filteredAndSortedItems = useMemo(
    () =>
      getFilteredAndSortedItems(activeItems, {
        statusFilter,
        genreFilter,
        searchQuery,
        sortOrder,
      }),
    [activeItems, statusFilter, genreFilter, searchQuery, sortOrder]
  );

  const totalPages = useMemo(() => getTotalPages(filteredAndSortedItems), [filteredAndSortedItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, genreFilter, searchQuery, sortOrder, activeTab]);

  return (
    <AniListPageContent
      user={user}
      aboutPreview={aboutPreview}
      activities={activities}
      favorites={favorites}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      viewMode={viewMode}
      setViewMode={setViewMode}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      genreFilter={genreFilter}
      setGenreFilter={setGenreFilter}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      allGenres={allGenres}
      filteredAndSortedItems={filteredAndSortedItems}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      loading={loading}
      error={error}
      fetchAniListData={fetchAniListData}
    />
  );
}
