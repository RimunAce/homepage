import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent": "RespireHomepage/1.0",
  },
  timeout: 8000,
});

interface NewsItem {
  title: string;
  link: string;
  source: string;
}

// Trusted Malaysian news RSS feeds
const MALAYSIAN_NEWS_FEEDS = [
  { url: "https://www.bernama.com/en/rss/news.php", source: "Bernama" },
  { url: "https://www.thestar.com.my/rss/News", source: "The Star" },
  { url: "https://www.malaymail.com/feed", source: "Malay Mail" },
  { url: "https://www.nst.com.my/news.rss", source: "NST" },
  { url: "https://www.freemalaysiatoday.com/feed/", source: "FMT" },
];

async function fetchFeed(
  feedUrl: string,
  source: string
): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items || []).slice(0, 5).map((item) => ({
      title: item.title?.trim() || "Untitled",
      link: item.link || "#",
      source,
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
      MALAYSIAN_NEWS_FEEDS.map(({ url, source }) => fetchFeed(url, source))
    );

    // Collect all items
    const allItems: NewsItem[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }

    // Shuffle and pick 5 unique headlines
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    const unique = shuffled.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.title === item.title)
    );
    const selected = unique.slice(0, 5);

    return NextResponse.json({ news: selected });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
