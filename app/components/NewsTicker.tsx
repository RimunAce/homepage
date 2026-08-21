"use client";

import { useEffect, useState, useRef, memo, useCallback } from "react";

interface NewsItem {
  title: string;
  link: string;
  source: string;
}

const NEWS_CACHE_KEY = "respire_news_v1";
const CYCLE_MS = 40000;

function isNewsItem(value: unknown): value is NewsItem {
  if (!value || typeof value !== "object") return false;
  const item = value as NewsItem;
  return (
    typeof item.title === "string" &&
    typeof item.link === "string" &&
    typeof item.source === "string" &&
    item.title.length > 0 &&
    item.link.startsWith("http")
  );
}

function readNewsCache(): NewsItem[] | null {
  try {
    const raw = localStorage.getItem(NEWS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; news?: unknown };
    if (parsed?.v !== 1 || !Array.isArray(parsed.news)) return null;
    const news = parsed.news.filter(isNewsItem);
    return news.length > 0 ? news : null;
  } catch {
    return null;
  }
}

function writeNewsCache(news: NewsItem[]) {
  try {
    localStorage.setItem(
      NEWS_CACHE_KEY,
      JSON.stringify({ v: 1, news, ts: Date.now() })
    );
  } catch {
    return;
  }
}

function Headlines({
  items,
  interactive,
}: {
  items: NewsItem[];
  interactive: boolean;
}) {
  return items.map((item, i) => (
    <span key={`${item.source}-${i}`} className="inline-flex items-center">
      <span className="mx-1 font-bold">#{item.source}</span>
      {interactive ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-retro-black hover:underline mx-1"
        >
          {item.title}
        </a>
      ) : (
        <span className="text-retro-black mx-1">{item.title}</span>
      )}
      <span className="text-retro-black/40 mx-2">|</span>
    </span>
  ));
}

function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [usingCache, setUsingCache] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [held, setHeld] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  const paused = held || hoverPaused || reduceMotion;

  const scrollLoop = useCallback(function scrollLoop(ts: number) {
    const track = trackRef.current;
    if (!track) return;

    const children = track.children as HTMLCollectionOf<HTMLElement>;
    if (children.length < 2) return;

    const copyWidth = children[0].offsetWidth;
    if (!copyWidth) {
      animFrameRef.current = requestAnimationFrame(scrollLoop);
      return;
    }

    if (!lastTsRef.current) lastTsRef.current = ts;
    const dt = ts - lastTsRef.current;
    lastTsRef.current = ts;

    let offset = parseFloat(track.dataset.offset || "0");
    offset -= (copyWidth / CYCLE_MS) * dt;
    if (offset <= -copyWidth) {
      offset += copyWidth;
    }
    track.dataset.offset = String(offset);
    track.style.transform = `translateX(${offset}px) translateZ(0)`;

    animFrameRef.current = requestAnimationFrame(scrollLoop);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (news.length === 0 || paused) return;

    lastTsRef.current = 0;
    animFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [news, scrollLoop, paused]);

  useEffect(() => {
    let cancelled = false;

    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const items = (Array.isArray(data.news) ? data.news : []).filter(isNewsItem);
        if (items.length === 0) throw new Error("Empty news");
        writeNewsCache(items);
        if (!cancelled) {
          setNews(items);
          setUsingCache(false);
          setUnavailable(false);
        }
      } catch {
        if (cancelled) return;
        const cached = readNewsCache();
        if (cached) {
          setNews(cached);
          setUsingCache(true);
          setUnavailable(false);
        } else {
          setNews([]);
          setUsingCache(false);
          setUnavailable(true);
        }
      }
    }

    const cached = readNewsCache();
    if (cached) {
      setNews(cached);
      setUsingCache(true);
    }

    fetchNews();

    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (unavailable && news.length === 0) {
    return (
      <div className="bg-retro-white text-retro-black py-1 border-b-2 border-retro-black relative z-10">
        <div className="text-xs font-mono text-center">Malaysian headlines unavailable</div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-retro-white text-retro-black py-1 border-b-2 border-retro-black relative z-10">
        <div className="text-xs font-mono text-center">Loading Malaysian news…</div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#f2f2f2] text-retro-black py-1.5 overflow-hidden relative z-10 border-b-2 border-retro-black"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHoverPaused(false);
        }
      }}
    >
      <p className="sr-only">
        {usingCache ? "Cached Malaysian headlines" : "Malaysian news headlines"}
      </p>

      <span className="absolute left-0 top-0 bottom-0 bg-retro-white text-retro-black text-xs font-bold px-2 flex items-center z-10 border-r-2 border-retro-black whitespace-nowrap">
        {usingCache ? "MY NEWS · CACHED" : "MY NEWS"}
      </span>

      {!reduceMotion && (
        <button
          type="button"
          className="absolute right-0 top-0 bottom-0 z-10 bg-retro-white text-retro-black text-xs font-bold px-2 border-l-2 border-retro-black"
          onClick={() => setHeld((v) => !v)}
          aria-pressed={held}
        >
          {held ? "Play" : "Pause"}
        </button>
      )}

      <div className={`overflow-hidden ${usingCache ? "pl-36" : "pl-20"} ${reduceMotion ? "" : "pr-14"}`}>
        {reduceMotion ? (
          <a
            href={news[0].link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs font-mono truncate text-retro-black hover:underline"
          >
            {news[0].source}: {news[0].title}
          </a>
        ) : (
          <div
            ref={trackRef}
            className="flex whitespace-nowrap text-xs font-mono will-change-transform"
            style={{ transform: "translateX(0) translateZ(0)" }}
            data-offset="0"
          >
            <span className="inline-flex items-center gap-1 shrink-0">
              <Headlines items={news} interactive />
            </span>
            <span className="inline-flex items-center gap-1 shrink-0" aria-hidden="true">
              <Headlines items={news} interactive={false} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(NewsTicker);
