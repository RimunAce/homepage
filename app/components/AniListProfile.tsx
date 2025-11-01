"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

interface AniListProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AniListProfile({ isOpen, onClose }: AniListProfileProps) {
  const [user, setUser] = useState<AniListUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAniListProfile();
    }
  }, [isOpen]);

  const fetchAniListProfile = async () => {
    setLoading(true);
    setError(null);

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

    const variables = {
      userName: "Reuzin"
    };

    try {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setUser(data.data.User);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch AniList profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-retro-white border-2 border-retro-black max-w-4xl w-full max-h-[90vh] overflow-y-auto retro-scrollbar"
        style={{ boxShadow: "4px 4px 0px #000000" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-retro-black text-retro-white p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold">My AniList Profile</h2>
          <button
            className="retro-button bg-retro-white text-retro-black text-sm"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-retro-black"></div>
              <p className="mt-4 retro-text">Loading AniList profile...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-2 border-red-500 p-4 mb-4">
              <p className="text-red-700 retro-text">Error: {error}</p>
              <button
                className="retro-button mt-2 text-sm"
                onClick={fetchAniListProfile}
              >
                Retry
              </button>
            </div>
          )}

          {user && !loading && !error && (
            <div className="space-y-6">
              {/* Profile Header */}
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
                  <h3 className="text-2xl font-bold mb-2">{user.name}</h3>
                  {user.about && (
                    <div 
                      className="retro-text mb-4 p-3 bg-retro-gray border-2 border-retro-black"
                      dangerouslySetInnerHTML={{ __html: user.about }}
                    />
                  )}
                  <a
                    href={`https://anilist.co/user/${user.name}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-link inline-block"
                  >
                    View on AniList →
                  </a>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Anime Stats */}
                <div className="retro-card">
                  <h4 className="retro-heading text-retro-black mb-4">Anime Statistics</h4>
                  <div className="space-y-2 retro-text">
                    <div className="flex justify-between">
                      <span>Total Anime:</span>
                      <span className="font-bold">{user.statistics.anime.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Episodes Watched:</span>
                      <span className="font-bold">{user.statistics.anime.episodesWatched}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean Score:</span>
                      <span className="font-bold">{user.statistics.anime.meanScore || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Manga Stats */}
                <div className="retro-card">
                  <h4 className="retro-heading text-retro-black mb-4">Manga Statistics</h4>
                  <div className="space-y-2 retro-text">
                    <div className="flex justify-between">
                      <span>Total Manga:</span>
                      <span className="font-bold">{user.statistics.manga.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chapters Read:</span>
                      <span className="font-bold">{user.statistics.manga.chaptersRead}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean Score:</span>
                      <span className="font-bold">{user.statistics.manga.meanScore || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Image */}
              {user.bannerImage && (
                <div className="mt-6">
                  <h4 className="retro-heading text-retro-black mb-4">Banner</h4>
                  <img
                    src={user.bannerImage}
                    alt={`${user.name}'s banner`}
                    className="w-full border-2 border-retro-black"
                    style={{ boxShadow: "2px 2px 0px #000000" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}