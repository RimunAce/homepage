import { Query } from "appwrite";
import {
  APPWRITE_DATABASE_ID,
  TABLES,
  getTablesDB,
} from "./appwrite";
import { logger } from "./logger";

export interface Update {
  date: string;
  time: string;
  content: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  status: string;
  link: string;
  date: string;
  thumbnail: string;
}

export interface GalleryImage {
  url: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Track {
  id: string;
  title: string;
  thumbnail: string;
  audio: string;
  author: string;
  authorUrl: string;
}

type Row = Record<string, unknown>;

async function listRows(
  table: string,
  queries: string[] = []
): Promise<Row[]> {
  const result = await getTablesDB().listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: table,
    queries,
  });
  return result.rows as Row[];
}

async function loadStatic<T>(file: string): Promise<T> {
  const res = await fetch(`/data/${file}`);
  if (!res.ok) throw new Error(`Failed to load /data/${file}`);
  return res.json();
}

/**
 * Reads a table from Appwrite, falling back to the bundled JSON snapshot when
 * the request fails so the page still renders offline or during an outage.
 */
async function readTable<T>(
  table: string,
  queries: string[],
  fallbackFile: string,
  map: (row: Row) => T
): Promise<T[]> {
  try {
    const rows = await listRows(table, queries);
    if (rows.length > 0) return rows.map(map);
    logger.warn(`Appwrite table "${table}" is empty, using static fallback`);
  } catch (error) {
    logger.error(`Failed to read Appwrite table "${table}":`, error);
  }
  return loadStatic<T[]>(fallbackFile);
}

export function fetchUpdates(): Promise<Update[]> {
  return readTable(
    TABLES.updates,
    [Query.orderDesc("sortKey")],
    "updates.json",
    (row) => ({
      date: String(row.date ?? ""),
      time: String(row.time ?? ""),
      content: String(row.content ?? ""),
    })
  );
}

export function fetchProjects(): Promise<Project[]> {
  return readTable(
    TABLES.projects,
    [Query.orderAsc("sortKey")],
    "projects.json",
    (row) => ({
      title: String(row.title ?? ""),
      description: String(row.description ?? ""),
      tech: Array.isArray(row.tech) ? (row.tech as string[]) : [],
      status: String(row.status ?? ""),
      link: String(row.link ?? ""),
      date: String(row.date ?? ""),
      thumbnail: String(row.thumbnail ?? ""),
    })
  );
}

export function fetchGallery(): Promise<GalleryImage[]> {
  return readTable(
    TABLES.gallery,
    [Query.orderAsc("sortKey")],
    "gallery.json",
    (row) => ({
      url: String(row.url ?? ""),
      width: Number(row.width ?? 0),
      height: Number(row.height ?? 0),
      caption: row.caption ? String(row.caption) : undefined,
    })
  );
}

function mapTrack(row: Row): Track {
  return {
    id: String(row.trackId ?? ""),
    title: String(row.title ?? ""),
    thumbnail: String(row.thumbnail ?? ""),
    audio: String(row.audio ?? ""),
    author: String(row.author ?? ""),
    authorUrl: String(row.authorUrl ?? ""),
  };
}

export function fetchPlaylist(playlist: "teto" | "miku"): Promise<Track[]> {
  return readTable(
    TABLES.music,
    [Query.equal("playlist", playlist), Query.orderAsc("sortKey")],
    playlist === "miku" ? "music-miku.json" : "music.json",
    mapTrack
  );
}
