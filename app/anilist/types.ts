export interface AniListUser {
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

export interface Activity {
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

export interface MediaItem {
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

export interface RawMediaListEntry {
  status: string;
  score: number;
  progress: number;
  media: Omit<MediaItem, "mediaListEntry">;
}

export interface MediaListCollectionData {
  MediaListCollection: {
    lists: Array<{
      entries: RawMediaListEntry[];
    }>;
  };
}

export interface UserApiResponse {
  User: AniListUser;
}

export interface ActivityApiResponse {
  Page: {
    activities: Activity[];
  };
}

export interface AniListData {
  user: AniListUser;
  activities: Activity[];
  animeList: MediaItem[];
  mangaList: MediaItem[];
}

export interface CachedAniListData {
  data: AniListData;
  timestamp: number;
}

export interface StatRow {
  label: string;
  value: string | number;
}

export interface MediaFilterState {
  statusFilter: MediaStatus;
  genreFilter: string;
  searchQuery: string;
  sortOrder: SortOrder;
}

export interface MediaListState {
  activities: Activity[];
  animeList: MediaItem[];
  mangaList: MediaItem[];
}

export type GraphQLResponse<T> = {
  data: T;
  errors?: Array<{
    message: string;
  }>;
};

export type MediaStatus = "ALL" | "CURRENT" | "COMPLETED" | "PAUSED" | "DROPPED" | "PLANNING" | "REPEATING";
export type SortOrder = "TITLE_ASC" | "TITLE_DESC" | "SCORE_ASC" | "SCORE_DESC" | "NONE";
export type ViewMode = "grid" | "list";
