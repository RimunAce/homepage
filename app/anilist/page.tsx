"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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

type MediaStatus = "ALL" | "CURRENT" | "COMPLETED" | "PAUSED" | "DROPPED" | "PLANNING" | "REPEATING";
type SortOrder = "TITLE_ASC" | "TITLE_DESC" | "SCORE_ASC" | "SCORE_DESC" | "NONE";
type ViewMode = "grid" | "list";

const CACHE_KEY = "anilist_data_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  const itemsPerPage = 10;

  // Sanitize user.about with DOMPurify and create a plain-text truncated preview
  const aboutPreview = useMemo(() => {
    if (!user?.about) return null;
    const plain = DOMPurify.sanitize(user.about, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return plain.length > 200 ? `${plain.slice(0, 200)}...` : plain;
  }, [user?.about]);

  useEffect(() => {
    loadDataWithCache();
  }, []);

  const loadDataWithCache = async () => {
    // Try to load from cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setUser(data.user);
          setActivities(data.activities);
          setAnimeList(data.animeList);
          setMangaList(data.mangaList);
          return;
        }
      } catch (e) {
        console.error("Cache parse error:", e);
      }
    }

    // If no cache or expired, fetch fresh data
    await fetchAniListData();
  };

  const fetchAniListData = async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchUserProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch AniList data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const query = `
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

    const variables = { userName: "Reuzin" };
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
    const userData = data.data.User;
    setUser(userData);

    // After getting user, fetch the rest of the data
    try {
      const [activitiesData, animeData, mangaData] = await Promise.all([
        fetchActivitiesWithUserId(userData.id),
        fetchMediaList("ANIME"),
        fetchMediaList("MANGA")
      ]);

      // Cache the data
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: {
          user: userData,
          activities: activitiesData,
          animeList: animeData,
          mangaList: mangaData
        },
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error("Error fetching additional data:", err);
    }
  };

  const fetchActivitiesWithUserId = async (userId: number) => {
    const query = `
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

    const variables = { userId, page: 1, perPage: 10 };
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
    const activitiesData = data.data.Page.activities;
    setActivities(activitiesData);
    return activitiesData;
  };

  const fetchMediaList = async (type: "ANIME" | "MANGA") => {
    const query = `
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

    const variables = { userName: "Reuzin", type };
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);

    const entries = data.data.MediaListCollection.lists.flatMap((list: any) =>
      list.entries.map((entry: any) => ({
        ...entry.media,
        mediaListEntry: {
          status: entry.status,
          score: entry.score,
          progress: entry.progress,
        },
      }))
    );

    if (type === "ANIME") {
      setAnimeList(entries);
      return entries;
    } else {
      setMangaList(entries);
      return entries;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get all unique genres
  const allGenres = useMemo(() => {
    const items = activeTab === "anime" ? animeList : mangaList;
    const genres = new Set<string>();
    items.forEach(item => {
      item.genres?.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [activeTab, animeList, mangaList]);

  // Get favorites (top rated items)
  const favorites = useMemo(() => {
    const items = activeTab === "anime" ? animeList : mangaList;
    return items
      .filter(item => (item.mediaListEntry?.score || 0) >= 8)
      .sort((a, b) => (b.mediaListEntry?.score || 0) - (a.mediaListEntry?.score || 0))
      .slice(0, 5);
  }, [activeTab, animeList, mangaList]);

  // Filter and sort media items
  const filteredAndSortedItems = useMemo(() => {
    const items = activeTab === "anime" ? animeList : mangaList;

    // Apply status filter
    let filtered = items;
    if (statusFilter !== "ALL") {
      filtered = items.filter(item =>
        item.mediaListEntry?.status === statusFilter
      );
    }

    // Apply genre filter
    if (genreFilter !== "ALL") {
      filtered = filtered.filter(item =>
        item.genres?.includes(genreFilter)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.romaji.toLowerCase().includes(query) ||
        (item.title.english?.toLowerCase().includes(query) ?? false)
      );
    }

    // Apply sorting
    let sorted = [...filtered];
    switch (sortOrder) {
      case "TITLE_ASC":
        sorted.sort((a, b) =>
          (a.title.english || a.title.romaji).localeCompare(b.title.english || b.title.romaji)
        );
        break;
      case "TITLE_DESC":
        sorted.sort((a, b) =>
          (b.title.english || b.title.romaji).localeCompare(a.title.english || a.title.romaji)
        );
        break;
      case "SCORE_ASC":
        sorted.sort((a, b) =>
          (a.mediaListEntry?.score || 0) - (b.mediaListEntry?.score || 0)
        );
        break;
      case "SCORE_DESC":
        sorted.sort((a, b) =>
          (b.mediaListEntry?.score || 0) - (a.mediaListEntry?.score || 0)
        );
        break;
    }

    return sorted;
  }, [activeTab, animeList, mangaList, statusFilter, genreFilter, searchQuery, sortOrder]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, genreFilter, searchQuery, sortOrder, activeTab]);

  // Loading Skeleton Component
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="w-full aspect-[2/3] bg-retro-gray border-2 border-retro-black"></div>
      <div className="mt-2 space-y-2">
        <div className="h-3 bg-retro-gray border border-retro-black"></div>
        <div className="h-2 bg-retro-gray border border-retro-black w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-retro-gray relative">
      <Background />

      {/* Header */}
      <header className="bg-retro-black text-retro-white py-2 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">MY ANILIST</h1>
          <span className="text-sm">KASANE</span>
        </div>
      </header>

      {/* Scrolling Text Banner */}
      <div className="bg-retro-black text-retro-white py-1 overflow-hidden relative z-10">
        <motion.div
          className="flex whitespace-nowrap text-xs font-mono"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {Array.from({ length: 40 }, (_, i) => i).map((id) => (
            <span key={`banner-${id}`} className="mx-4">
              WE ARE NOT FINISHED //
            </span>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="bg-retro-white border-b-2 border-retro-black relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex flex-wrap gap-2">
            <Link href="/" passHref legacyBehavior>
              <motion.a className="retro-button text-sm" whileTap={{ scale: 0.95 }}>
                HOME
              </motion.a>
            </Link>
            <Link href="/gallery" passHref legacyBehavior>
              <motion.a className="retro-button text-sm" whileTap={{ scale: 0.95 }}>
                GALLERY
              </motion.a>
            </Link>
            <Link href="/anilist" passHref legacyBehavior>
              <motion.a className="retro-button text-sm" whileTap={{ scale: 0.95 }}>
                MY ANILIST
              </motion.a>
            </Link>
            <Link href="/music" passHref legacyBehavior>
              <motion.a className="retro-button text-sm" whileTap={{ scale: 0.95 }}>
                MUSIC PLAYER
              </motion.a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {loading && (
          <div className="space-y-6">
            {/* Profile Skeleton */}
            <div className="retro-card animate-pulse">
              <div className="flex gap-6">
                <div className="w-32 h-32 bg-retro-gray border-2 border-retro-black"></div>
                <div className="flex-grow space-y-3">
                  <div className="h-6 bg-retro-gray border-2 border-retro-black w-1/3"></div>
                  <div className="h-20 bg-retro-gray border-2 border-retro-black"></div>
                </div>
              </div>
            </div>
            {/* Grid Skeleton */}
            <div className="retro-card">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-500 p-4 mb-4">
            <p className="text-red-700 retro-text">Error: {error}</p>
            <button className="retro-button mt-2 text-sm" onClick={fetchAniListData}>
              Retry
            </button>
          </div>
        )}

        {user && !loading && (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="retro-card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={user.avatar.large}
                    alt={`${user.name}'s avatar`}
                    className="w-32 h-32 border-2 border-retro-black"
                    style={{ boxShadow: "2px 2px 0px #000000" }}
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                  {aboutPreview && (
                    <div
                      className="retro-text mb-4 p-3 bg-retro-gray border-2 border-retro-black max-h-32 overflow-y-auto"
                    >
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

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-retro-gray border-2 border-retro-black">
                  <h3 className="retro-heading text-sm mb-3">ANIME STATS</h3>
                  <div className="space-y-1 retro-text text-xs">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold">{user.statistics.anime.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Episodes:</span>
                      <span className="font-bold">{user.statistics.anime.episodesWatched}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean Score:</span>
                      <span className="font-bold">{user.statistics.anime.meanScore || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-retro-gray border-2 border-retro-black">
                  <h3 className="retro-heading text-sm mb-3">MANGA STATS</h3>
                  <div className="space-y-1 retro-text text-xs">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold">{user.statistics.manga.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chapters:</span>
                      <span className="font-bold">{user.statistics.manga.chaptersRead}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean Score:</span>
                      <span className="font-bold">{user.statistics.manga.meanScore || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="retro-card">
                <h3 className="retro-heading mb-4">⭐ FAVORITES (8+ SCORE)</h3>
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
                        <img
                          src={item.coverImage.large}
                          alt={item.title.romaji}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-retro-black px-2 py-1 text-xs font-bold">
                          {item.mediaListEntry?.score}
                        </div>
                      </div>
                      <p className="retro-text text-xs font-bold truncate mt-2 group-hover:text-blue-600">
                        {item.title.english || item.title.romaji}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activities */}
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
                        <img
                          src={activity.media.coverImage.large}
                          alt={activity.media.title.romaji}
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
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(activity.createdAt)}
                        </p>
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

            {/* Media Lists */}
            <div className="retro-card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                {/* Tab Buttons */}
                <div className="flex gap-2">
                  <button
                    className={`retro-button text-sm ${activeTab === "anime" ? "bg-retro-black text-retro-white" : ""
                      }`}
                    onClick={() => setActiveTab("anime")}
                  >
                    📺 ANIME LIST
                  </button>
                  <button
                    className={`retro-button text-sm ${activeTab === "manga" ? "bg-retro-black text-retro-white" : ""
                      }`}
                    onClick={() => setActiveTab("manga")}
                  >
                    📖 MANGA LIST
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <button
                    className={`retro-button text-sm ${viewMode === "grid" ? "bg-retro-black text-retro-white" : ""
                      }`}
                    onClick={() => setViewMode("grid")}
                  >
                    ▦ GRID
                  </button>
                  <button
                    className={`retro-button text-sm ${viewMode === "list" ? "bg-retro-black text-retro-white" : ""
                      }`}
                    onClick={() => setViewMode("list")}
                  >
                    ☰ LIST
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                {/* Search Bar */}
                <div>
                  <input
                    type="text"
                    placeholder="Search titles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="retro-input w-full text-xs"
                  />
                </div>

                {/* Status Filter */}
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

                {/* Genre Filter */}
                <div>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="retro-input w-full text-xs"
                  >
                    <option value="ALL">All Genres</option>
                    {allGenres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
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

              {/* Results count */}
              <p className="text-xs text-gray-600 mb-3">
                Showing {filteredAndSortedItems.length} {activeTab === "anime" ? "anime" : "manga"}
              </p>

              {/* Media Grid/List View */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {getCurrentPageItems().map((item) => (
                    <a
                      key={item.id}
                      href={item.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group cursor-pointer"
                    >
                      <div className="relative w-full aspect-[2/3] border-2 border-retro-black overflow-hidden">
                        <img
                          src={item.coverImage.large}
                          alt={item.title.romaji}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {item.mediaListEntry?.status === "CURRENT" && (
                          <div className="absolute bottom-0 left-0 right-0 bg-retro-black bg-opacity-90 p-1">
                            <div className="h-2 bg-retro-gray border border-retro-white">
                              <div
                                className="h-full bg-green-500"
                                style={{
                                  width: `${((item.mediaListEntry.progress || 0) / (item.episodes || item.chapters || 100)) * 100}%`
                                }}
                              />
                            </div>
                            <p className="text-white text-xs text-center mt-1">
                              {item.mediaListEntry.progress} / {item.episodes || item.chapters || "?"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="retro-text text-xs font-bold truncate group-hover:text-blue-600">
                          {item.title.english || item.title.romaji}
                        </p>
                        {item.mediaListEntry && (
                          <div className="text-xs mt-1">
                            <p className="text-gray-600">{item.mediaListEntry.status}</p>
                            {item.mediaListEntry.score > 0 && (
                              <p className="text-gray-600">⭐ {item.mediaListEntry.score}/10</p>
                            )}
                          </div>
                        )}
                        {item.genres && item.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.genres.slice(0, 2).map(genre => (
                              <span key={genre} className="text-xs bg-retro-gray border border-retro-black px-1">
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {getCurrentPageItems().map((item) => (
                    <a
                      key={item.id}
                      href={item.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 bg-retro-gray border-2 border-retro-black hover:bg-retro-white transition-colors"
                    >
                      <img
                        src={item.coverImage.large}
                        alt={item.title.romaji}
                        className="w-16 h-24 object-cover border border-retro-black"
                      />
                      <div className="flex-grow">
                        <p className="retro-text text-sm font-bold">
                          {item.title.english || item.title.romaji}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.mediaListEntry?.status}
                          {item.mediaListEntry?.status === "CURRENT" &&
                            ` • ${item.mediaListEntry.progress} / ${item.episodes || item.chapters || "?"}`
                          }
                        </p>
                        {item.genres && item.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.genres.slice(0, 4).map(genre => (
                              <span key={genre} className="text-xs bg-retro-white border border-retro-black px-2 py-1">
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {item.mediaListEntry && item.mediaListEntry.score > 0 && (
                        <div className="text-right">
                          <div className="text-2xl font-bold">⭐</div>
                          <div className="text-sm font-bold">{item.mediaListEntry.score}/10</div>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* No results message */}
              {filteredAndSortedItems.length === 0 && (
                <p className="retro-text text-center py-8">
                  No {activeTab === "anime" ? "anime" : "manga"} found with current filters
                </p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
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
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}