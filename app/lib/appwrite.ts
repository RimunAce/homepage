import { Client, TablesDB, Storage } from "appwrite";

const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://syd.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";

export const APPWRITE_DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "homepage";
export const APPWRITE_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ?? "gallery";

export const TABLES = {
  updates: "updates",
  projects: "projects",
  gallery: "gallery",
  music: "music",
} as const;

let client: Client | null = null;

export function getAppwriteClient(): Client {
  if (!client) {
    client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  }
  return client;
}

export function getTablesDB(): TablesDB {
  return new TablesDB(getAppwriteClient());
}

export function getStorage(): Storage {
  return new Storage(getAppwriteClient());
}

export function getFileViewUrl(fileId: string): string {
  return `${ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}
