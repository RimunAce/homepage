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

interface RawMediaListEntry {
  status: string;
  score: number;
  progress: number;
  media: Omit<MediaItem, "mediaListEntry">;
}

interface MediaListCollectionData {
  MediaListCollection: {
    lists: Array<{
      entries: RawMediaListEntry[];
    }>;
  };
}

interface UserApiResponse {
  User: AniListUser;
}

interface ActivityApiResponse {
  Page: {
    activities: Activity[];
  };
}

interface AniListData {
  user: AniListUser;
  activities: Activity[];
  animeList: MediaItem[];
  mangaList: MediaItem[];
}

interface CachedAniListData {
  data: AniListData;
  timestamp: number;
}

interface StatRow {
  label: string;
  value: string | number;
}

interface MediaFilterState {
  statusFilter: MediaStatus;
  genreFilter: string;
  searchQuery: string;
  sortOrder: SortOrder;
}

type GraphQLResponse<T> = {
  data: T;
  errors?: Array<{
    message: string;
  }>;
};

type MediaStatus = "ALL" | "CURRENT" | "COMPLETED" | "PAUSED" | "DROPPED" | "PLANNING" | "REPEATING";
type SortOrder = "TITLE_ASC" | "TITLE_DESC" | "SCORE_ASC" | "SCORE_DESC" | "NONE";
type ViewMode = "grid" | "list";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";
const ANILIST_USERNAME = "Reuzin";
const CACHE_KEY = "anilist_data_cache";
const CACHE_DURATION = 5 * 60 * 1000;
const ITEMS_PER_PAGE = 10;

const STATUS_FILTER_OPTIONS: MediaStatus[] = ["ALL", "CURRENT", "COMPLETED", "PAUSED", "DROPPED", "PLANNING", "REPEATING"];

const SORT_FILTER_OPTIONS: Array<{ value: SortOrder; label: string }> = [
  { value: "NONE", label: "Default Order" },
  { value: "TITLE_ASC", label: "Title (A-Z)" },
  { value: "TITLE_DESC", label: "Title (Z-A)" },
  { value: "SCORE_ASC", label: "Score (Low-High)" },
  { value: "SCORE_DESC", label: "Score (High-Low)" },
];

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

async function fetchAnilistGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed (${response.status})`);
  }

  const data = (await response.json()) as GraphQLResponse<T>;
  if (data.errors?.length) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
}

async function fetchActivities(userId: number): Promise<Activity[]> {
  const data = await fetchAnilistGraphQL<ActivityApiResponse>(ACTIVITIES_QUERY, { userId, page: 1, perPage: 10 });
  return data.Page.activities;
}

async function fetchMediaList(type: "ANIME" | "MANGA"): Promise<MediaItem[]> {
  const data = await fetchAnilistGraphQL<MediaListCollectionData>(MEDIA_LIST_QUERY, { userName: ANILIST_USERNAME, type });
  const entries: MediaItem[] = [];

  data.MediaListCollection.lists.forEach((list) => {
    list.entries.forEach((entry) => {
      entries.push({
        ...entry.media,
        mediaListEntry: {
          status: entry.status,
          score: entry.score,
          progress: entry.progress,
        },
      });
    });
  });

  return entries;
}

async function fetchAniListData(): Promise<AniListData> {
  const userResponse = await fetchAnilistGraphQL<UserApiResponse>(USER_PROFILE_QUERY, { userName: ANILIST_USERNAME });
  const user = userResponse.User;

  try {
    const [activitiesData, animeData, mangaData] = await Promise.all([
      fetchActivities(user.id),
      fetchMediaList("ANIME"),
      fetchMediaList("MANGA"),
    ]);

    return {
      user,
      activities: activitiesData,
      animeList: animeData,
      mangaList: mangaData,
    };
  } catch (error) {
    console.error("Error fetching additional data:", error);
    return {
      user,
      activities: [],
      animeList: [],
      mangaList: [],
    };
  }
}

function saveAniListCache(data: AniListData) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}

function loadCachedAniListData(): AniListData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as Partial<CachedAniListData>;
    if (!parsed.data || typeof parsed.timestamp !== "number") return null;
    if (Date.now() - parsed.timestamp >= CACHE_DURATION) return null;

    return parsed.data;
  } catch (error) {
    console.error("Cache parse error:", error);
    return null;
  }
}

function sanitizeAbout(about: string | null) {
  if (!about) return null;
  const plain = DOMPurify.sanitize(about, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return plain.length > 200 ? `${plain.slice(0, 200)}...` : plain;
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getMediaItemsForTab(activeTab: "anime" | "manga", animeList: MediaItem[], mangaList: MediaItem[]) {
  return activeTab === "anime" ? animeList : mangaList;
}

function getUniqueGenres(items: MediaItem[]) {
  const genres = new Set<string>();
  items.forEach((item) => item.genres?.forEach((genre) => genres.add(genre)));
  return Array.from(genres).sort();
}

function getFavorites(items: MediaItem[]) {
  return items
    .filter((item) => (item.mediaListEntry?.score || 0) >= 8)
    .sort((a, b) => (b.mediaListEntry?.score || 0) - (a.mediaListEntry?.score || 0))
    .slice(0, 5);
}

function getDisplayTitle(item: MediaItem) {
  return item.title.english || item.title.romaji;
}

function filterAndSortMedia(items: MediaItem[], filters: MediaFilterState) {
  let filtered = items;

  if (filters.statusFilter !== "ALL") {
    filtered = filtered.filter((item) => item.mediaListEntry?.status === filters.statusFilter);
  }

  if (filters.genreFilter !== "ALL") {
    filtered = filtered.filter((item) => item.genres?.includes(filters.genreFilter));
  }

  const query = filters.searchQuery.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((item) => getDisplayTitle(item).toLowerCase().includes(query));
  }

  const sorted = [...filtered];
  switch (filters.sortOrder) {
    case "TITLE_ASC":
      sorted.sort((a, b) => getDisplayTitle(a).localeCompare(getDisplayTitle(b)));
      break;
    case "TITLE_DESC":
      sorted.sort((a, b) => getDisplayTitle(b).localeCompare(getDisplayTitle(a)));
      break;
    case "SCORE_ASC":
      sorted.sort((a, b) => (a.mediaListEntry?.score || 0) - (b.mediaListEntry?.score || 0));
      break;
    case "SCORE_DESC":
      sorted.sort((a, b) => (b.mediaListEntry?.score || 0) - (a.mediaListEntry?.score || 0));
      break;
  }

  return sorted;
}

function getCurrentPageItems(items: MediaItem[], currentPage: number) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return items.slice(startIndex, endIndex);
}

function getProgressTotal(item: MediaItem) {
  return item.episodes || item.chapters || 100;
}

function getProgressPercent(item: MediaItem) {
  const total = getProgressTotal(item);
  return Math.min(100, Math.max(0, ((item.mediaListEntry?.progress || 0) / total) * 100));
}

function getProgressLabel(item: MediaItem) {
  return `${item.mediaListEntry?.progress || 0} / ${getProgressTotal(item)}`;
}

function PageHeader() {
  return (
    <header className="bg-retro-black text-retro-white py-2 px-4 relative z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">MY ANILIST</h1>
        <span className="text-sm">KASANE</span>
      </div>
    </header>
  );
}

function ScrollingBanner() {
  return (
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
}

function PageNavigation() {
  return (
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
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[2/3] bg-retro-gray border-2 border-retro-black"></div>
      <div className="mt-2 space-y-2">
        <div className="h-3 bg-retro-gray border border-retro-black"></div>
        <div className="h-2 bg-retro-gray border border-retro-black w-2/3"></div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
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
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-100 border-2 border-red-500 p-4 mb-4">
      <p className="text-red-700 retro-text">Error: {message}</p>
      <button className="retro-button mt-2 text-sm" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

function ProfileSection({ user, aboutPreview }: { user: AniListUser; aboutPreview: string | null }) {
  return (
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
        <StatPanel
          title="ANIME STATS"
          stats={[
            { label: "Total:", value: user.statistics.anime.count },
            { label: "Episodes:", value: user.statistics.anime.episodesWatched },
            { label: "Mean Score:", value: user.statistics.anime.meanScore || "N/A" },
          ]}
        />
        <StatPanel
          title="MANGA STATS"
          stats={[
            { label: "Total:", value: user.statistics.manga.count },
            { label: "Chapters:", value: user.statistics.manga.chaptersRead },
            { label: "Mean Score:", value: user.statistics.manga.meanScore || "N/A" },
          ]}
        />
      </div>
    </div>
  );
}

function StatPanel({ title, stats }: { title: string; stats: StatRow[] }) {
  return (
    <div className="p-4 bg-retro-gray border-2 border-retro-black">
      <h3 className="retro-heading text-sm mb-3">{title}</h3>
      <div className="space-y-1 retro-text text-xs">
        {stats.map((stat) => (
          <div className="flex justify-between" key={stat.label}>
            <span>{stat.label}</span>
            <span className="font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritesSection({ favorites }: { favorites: MediaItem[] }) {
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

function RecentActivities({ activities }: { activities: Activity[] }) {
  return (
    <div className="retro-card">
      <h3 className="retro-heading mb-4">RECENT ACTIVITIES</h3>
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
          <p className="retro-text text-center py-4">No recent activities</p>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
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

function AniListContent({
  user,
  aboutPreview,
  activities,
  animeList,
  mangaList,
  activeTab,
  setActiveTab,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  genreFilter,
  setGenreFilter,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
}: {
  user: AniListUser;
  aboutPreview: string | null;
  activities: Activity[];
  animeList: MediaItem[];
  mangaList: MediaItem[];
  activeTab: "anime" | "manga";
  setActiveTab: Dispatch<SetStateAction<"anime" | "manga">>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  statusFilter: MediaStatus;
  setStatusFilter: Dispatch<SetStateAction<MediaStatus>>;
  genreFilter: string;
  setGenreFilter: Dispatch<SetStateAction<string>>;
  sortOrder: SortOrder;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}) {
  const activeItems = useMemo(() => getMediaItemsForTab(activeTab, animeList, mangaList), [activeTab, animeList, mangaList]);
  const allGenres = useMemo(() => getUniqueGenres(activeItems), [activeItems]);
  const favorites = useMemo(() => getFavorites(activeItems), [activeItems]);
  const filteredAndSortedItems = useMemo(
    () =>
      filterAndSortMedia(activeItems, {
        statusFilter,
        genreFilter,
        searchQuery,
        sortOrder,
      }),
    [activeItems, statusFilter, genreFilter, searchQuery, sortOrder]
  );
  const currentPageItems = useMemo(() => getCurrentPageItems(filteredAndSortedItems, currentPage), [filteredAndSortedItems, currentPage]);
  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, genreFilter, searchQuery, sortOrder, activeTab, setCurrentPage]);

  return (
    <div className="space-y-6">
      <ProfileSection user={user} aboutPreview={aboutPreview} />
      <FavoritesSection favorites={favorites} />
      <RecentActivities activities={activities} />
      <MediaListSection
        activeTab={activeTab}
        allGenres={allGenres}
        currentPage={currentPage}
        currentPageItems={currentPageItems}
        filteredAndSortedItems={filteredAndSortedItems}
        genreFilter={genreFilter}
        searchQuery={searchQuery}
        setActiveTab={setActiveTab}
        setCurrentPage={setCurrentPage}
        setGenreFilter={setGenreFilter}
        setSearchQuery={setSearchQuery}
        setSortOrder={setSortOrder}
        setStatusFilter={setStatusFilter}
        setViewMode={setViewMode}
        sortOrder={sortOrder}
        statusFilter={statusFilter}
        totalPages={totalPages}
        viewMode={viewMode}
      />
    </div>
  );
}

function MediaListSection({
  activeTab,
  allGenres,
  currentPage,
  currentPageItems,
  filteredAndSortedItems,
  genreFilter,
  searchQuery,
  setActiveTab,
  setCurrentPage,
  setGenreFilter,
  setSearchQuery,
  setSortOrder,
  setStatusFilter,
  setViewMode,
  sortOrder,
  statusFilter,
  totalPages,
  viewMode,
}: {
  activeTab: "anime" | "manga";
  allGenres: string[];
  currentPage: number;
  currentPageItems: MediaItem[];
  filteredAndSortedItems: MediaItem[];
  genreFilter: string;
  searchQuery: string;
  setActiveTab: Dispatch<SetStateAction<"anime" | "manga">>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setGenreFilter: Dispatch<SetStateAction<string>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
  setStatusFilter: Dispatch<SetStateAction<MediaStatus>>;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  sortOrder: SortOrder;
  statusFilter: MediaStatus;
  totalPages: number;
  viewMode: ViewMode;
}) {
  return (
    <div className="retro-card">
      <MediaListControls activeTab={activeTab} setActiveTab={setActiveTab} viewMode={viewMode} setViewMode={setViewMode} />
      <MediaFilterBar
        allGenres={allGenres}
        genreFilter={genreFilter}
        searchQuery={searchQuery}
        setGenreFilter={setGenreFilter}
        setSearchQuery={setSearchQuery}
        setSortOrder={setSortOrder}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        statusFilter={statusFilter}
      />

      <p className="text-xs text-gray-600 mb-3">
        Showing {filteredAndSortedItems.length} {activeTab}
      </p>

      {filteredAndSortedItems.length === 0 && <EmptyMediaState activeTab={activeTab} />}

      {filteredAndSortedItems.length > 0 &&
        (viewMode === "grid" ? (
          <MediaListGrid items={currentPageItems} />
        ) : (
          <MediaListRows items={currentPageItems} />
        ))}

      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

function MediaListControls({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
}: {
  activeTab: "anime" | "manga";
  setActiveTab: Dispatch<SetStateAction<"anime" | "manga">>;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}) {
  return (
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
  );
}

function MediaFilterBar({
  allGenres,
  genreFilter,
  searchQuery,
  setGenreFilter,
  setSearchQuery,
  setSortOrder,
  setStatusFilter,
  sortOrder,
  statusFilter,
}: {
  allGenres: string[];
  genreFilter: string;
  searchQuery: string;
  setGenreFilter: Dispatch<SetStateAction<string>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
  setStatusFilter: Dispatch<SetStateAction<MediaStatus>>;
  sortOrder: SortOrder;
  statusFilter: MediaStatus;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
      <input
        type="text"
        placeholder="Search titles..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="retro-input w-full text-xs"
      />
      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value as MediaStatus)}
        className="retro-input w-full text-xs"
      >
        {STATUS_FILTER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)} className="retro-input w-full text-xs">
        <option value="ALL">All Genres</option>
        {allGenres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <select
        value={sortOrder}
        onChange={(event) => setSortOrder(event.target.value as SortOrder)}
        className="retro-input w-full text-xs"
      >
        {SORT_FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyMediaState({ activeTab }: { activeTab: "anime" | "manga" }) {
  return (
    <p className="retro-text text-center py-8">No {activeTab} found with current filters</p>
  );
}

function MediaListGrid({ items }: { items: MediaItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function MediaListRows({ items }: { items: MediaItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <MediaListItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <a href={item.siteUrl} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
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

function MediaProgressOverlay({ item }: { item: MediaItem }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-retro-black bg-opacity-90 p-1">
      <div className="h-2 bg-retro-gray border border-retro-white">
        <div className="h-full bg-green-500" style={{ width: `${getProgressPercent(item)}%` }} />
      </div>
      <p className="text-white text-xs text-center mt-1">{getProgressLabel(item)}</p>
    </div>
  );
}

function MediaListItem({ item }: { item: MediaItem }) {
  return (
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
          {item.mediaListEntry?.status || "Unknown"}
          {item.mediaListEntry?.status === "CURRENT" && ` • ${getProgressLabel(item)}`}
        </p>
        {item.genres?.slice(0, 4).map((genre) => (
          <span key={genre} className="text-xs bg-retro-white border border-retro-black px-2 py-1 mr-1">
            {genre}
          </span>
        ))}
      </div>
      {item.mediaListEntry && item.mediaListEntry.score > 0 && (
        <div className="text-right">
          <div className="text-2xl font-bold">⭐</div>
          <div className="text-sm font-bold">{item.mediaListEntry.score}/10</div>
        </div>
      )}
    </a>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        className="retro-button text-sm"
        onClick={() => onPageChange((page) => Math.max(1, page - 1))}
        disabled={currentPage === 1}
      >
        ← PREV
      </button>
      <span className="retro-button text-sm">
        {currentPage} / {totalPages}
      </span>
      <button
        className="retro-button text-sm"
        onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
      >
        NEXT →
      </button>
    </div>
  );
}

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
  const aboutPreview = useMemo(() => sanitizeAbout(user?.about ?? null), [user?.about]);

  const loadFreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAniListData();
      setUser(data.user);
      setActivities(data.activities);
      setAnimeList(data.animeList);
      setMangaList(data.mangaList);

      try {
        saveAniListCache(data);
      } catch (cacheError) {
        console.error("Cache save error:", cacheError);
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch AniList data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cachedData = loadCachedAniListData();
    if (cachedData) {
      setUser(cachedData.user);
      setActivities(cachedData.activities);
      setAnimeList(cachedData.animeList);
      setMangaList(cachedData.mangaList);
      return;
    }

    void loadFreshData();
  }, [loadFreshData]);

  return (
    <div className="min-h-screen bg-retro-gray relative">
      <Background />
      <PageHeader />
      <ScrollingBanner />
      <PageNavigation />

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={loadFreshData} />}
        {user && !loading && (
          <AniListContent
            activeTab={activeTab}
            activities={activities}
            aboutPreview={aboutPreview}
            animeList={animeList}
            currentPage={currentPage}
            genreFilter={genreFilter}
            mangaList={mangaList}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
            setCurrentPage={setCurrentPage}
            setGenreFilter={setGenreFilter}
            setSearchQuery={setSearchQuery}
            setSortOrder={setSortOrder}
            setStatusFilter={setStatusFilter}
            setViewMode={setViewMode}
            sortOrder={sortOrder}
            statusFilter={statusFilter}
            user={user}
            viewMode={viewMode}
          />
        )}
      </main>
    </div>
  );
}
