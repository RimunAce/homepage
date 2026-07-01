import { logger } from "./logger";

const GIST_ID = process.env.NEXT_PUBLIC_GIST_ID || "68b608362e6ec1efd00a65057d1e172c";
const GIST_USERNAME = process.env.NEXT_PUBLIC_GIST_USERNAME || "RimunAce";
const GIST_RAW_URL = `https://gist.githubusercontent.com/${GIST_USERNAME}/${GIST_ID}/raw`;

export const DATA_URLS = {
  gallery: `${GIST_RAW_URL}/gallery.json`,
  music: `${GIST_RAW_URL}/music.json`,
  musicMiku: `${GIST_RAW_URL}/music-miku.json`,
  projects: `${GIST_RAW_URL}/projects.json`,
  updates: `${GIST_RAW_URL}/updates.json`,
} as const;

export async function fetchRemoteData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from ${url}: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    logger.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
}
