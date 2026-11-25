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
      <span className="mx-1 font-semibold text-[#aeb5c4]">{item.source}</span>
      {interactive ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 inline-flex min-h-11 items-center text-[#f2f3f6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {item.title}
        </a>
      ) : (
        <span className="mx-1 text-[#f2f3f6]">{item.title}</span>
      )}
      <span className="mx-2 text-white/20">/</span>
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
      <div className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex min-h-11 w-full max-w-6xl items-center px-4 font-mono text-xs text-[#aeb5c4] sm:px-8">
          Malaysian headlines unavailable
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex min-h-11 w-full max-w-6xl items-center px-4 font-mono text-xs text-[#aeb5c4] sm:px-8">
          Loading Malaysian news.
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative z-10 border-b border-white/10"
      role="region"
      aria-label="Malaysian headlines"
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
      <div className="mx-auto flex min-h-11 w-full max-w-6xl items-stretch px-4 sm:px-8">
        <span className="flex shrink-0 items-center gap-2 pr-3 font-mono text-[.65rem] font-semibold text-[#f2f3f6]">
          MY NEWS
          {usingCache ? <span className="font-normal text-[#aeb5c4]">cached</span> : null}
        </span>
        <div className="flex min-w-0 flex-1 items-center overflow-hidden border-l border-white/10 pl-3">
          {reduceMotion ? (
            <a
              href={news[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block min-h-11 truncate font-mono text-xs leading-[2.75rem] text-[#f2f3f6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {news[0].source}: {news[0].title}
            </a>
          ) : (
            <div
              ref={trackRef}
              className="flex whitespace-nowrap font-mono text-xs will-change-transform"
              style={{ transform: "translateX(0) translateZ(0)" }}
              data-offset="0"
            >
              <span className="inline-flex shrink-0 items-center gap-1">
                <Headlines items={news} interactive />
              </span>
              <span className="inline-flex shrink-0 items-center gap-1" aria-hidden="true">
                <Headlines items={news} interactive={false} />
              </span>
            </div>
          )}
        </div>
        {!reduceMotion && (
          <button
            type="button"
            className="ml-2 min-h-11 min-w-11 shrink-0 border-l border-white/10 px-3 text-xs font-semibold text-[#f2f3f6] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => setHeld((v) => !v)}
            aria-pressed={held}
          >
            {held ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(NewsTicker);
