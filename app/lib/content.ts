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

const ROWS_PER_PAGE = 100;

async function listRows(
  table: string,
  queries: string[] = []
): Promise<Row[]> {
  const tablesDB = getTablesDB();
  const rows: Row[] = [];

  for (let offset = 0; ; offset += ROWS_PER_PAGE) {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: table,
      queries: [...queries, Query.limit(ROWS_PER_PAGE), Query.offset(offset)],
      total: false,
    });
    const page = result.rows as Row[];
    rows.push(...page);

    if (page.length < ROWS_PER_PAGE) {
      return rows;
    }
  }
}

async function readTable<T>(
  table: string,
  queries: string[],
  map: (row: Row) => T
): Promise<T[]> {
  try {
    const rows = await listRows(table, queries);
    return rows.map(map);
  } catch (error) {
    logger.error(`Failed to read Appwrite table "${table}":`, error);
    throw error;
  }
}

export function fetchUpdates(): Promise<Update[]> {
  return readTable(
    TABLES.updates,
    [Query.orderDesc("sortKey")],
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
    (row) => ({
      title: String(row.title ?? ""),
      description: String(row.description ?? ""),
      tech: Array.isArray(row.tech)
        ? row.tech.filter((value): value is string => typeof value === "string")
        : [],
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
    mapTrack
  );
}

async function firstRow(tableId: string, queries: string[]): Promise<Row | undefined> {
  const result = await getTablesDB().listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    queries: [...queries, Query.limit(1)],
    total: false,
  });
  return result.rows[0];
}

export function fetchHomeNote() {
  return firstRow(TABLES.updates, [Query.orderDesc("sortKey")]);
}

export async function fetchHomePhoto() {
  const result = await getTablesDB().listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.gallery,
    queries: [Query.orderAsc("sortKey"), Query.limit(8)],
    total: false,
  });
  const photos = result.rows.filter((row) => typeof row.url === "string" && row.url);
  return photos.find((row) => Number(row.height) > 0 && Number(row.width) >= Number(row.height) * 1.5)
    ?? photos[0];
}

export async function fetchHomeTrack(): Promise<Track | undefined> {
  const row = await firstRow(TABLES.music, [Query.equal("playlist", "teto"), Query.orderAsc("sortKey")]);
  return row ? mapTrack(row) : undefined;
}
