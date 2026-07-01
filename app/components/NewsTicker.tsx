"use client";

import { useEffect, useState, useRef, memo, useCallback } from "react";

interface NewsItem {
  title: string;
  link: string;
  source: string;
}

function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  const scrollLoop = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const children = track.children as HTMLCollectionOf<HTMLElement>;
    if (children.length < 2) return;

    const firstChild = children[0];
    const copyWidth = firstChild.offsetWidth;

    // Time-based: complete one copy-width scroll in 15 seconds
    const speed = copyWidth / (80 * 60); // px per frame at 60fps
    let offset = parseFloat(track.dataset.offset || "0");
    offset -= speed;

    // When we've scrolled past the first copy, reset seamlessly
    if (offset <= -copyWidth) {
      offset += copyWidth;
    }

    track.dataset.offset = String(offset);
    track.style.transform = `translateX(${offset}px) translateZ(0)`;

    animFrameRef.current = requestAnimationFrame(scrollLoop);
  }, []);

  useEffect(() => {
    if (news.length === 0) return;

    // Small delay to let DOM layout settle
    const timer = setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(scrollLoop);
    }, 50);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [news, scrollLoop]);

  useEffect(() => {
    let cancelled = false;

    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) setNews(data.news || []);
      } catch {
        if (!cancelled) {
          setNews([
            {
              title: "Malaysia announces new digital economy initiative",
              link: "https://www.bernama.com",
              source: "Bernama",
            },
            {
              title: "Ringgit strengthens against US dollar in early trade",
              link: "https://www.thestar.com.my",
              source: "The Star",
            },
            {
              title: "Heavy rainfall expected across Klang Valley this week",
              link: "https://www.nst.com.my",
              source: "NST",
            },
            {
              title: "Tourism Malaysia targets record visitor arrivals in 2026",
              link: "https://www.malaymail.com",
              source: "Malay Mail",
            },
            {
              title: "Local tech startups secure RM500mil in funding",
              link: "https://www.freemalaysiatoday.com",
              source: "FMT",
            },
          ]);
        }
      }
    }

    fetchNews();

    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (news.length === 0) {
    return (
      <div className="bg-retro-black text-retro-white py-1 overflow-hidden relative z-10">
        <div className="text-xs font-mono text-center animate-pulse">
          LOADING MALAYSIA NEWS...
        </div>
      </div>
    );
  }

  const tickerItems = (
    <>
      {news.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="text-retro-yellow mx-1 font-bold">
            #{item.source}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-retro-white hover:text-retro-yellow hover:underline transition-colors mx-1"
          >
            {item.title}
          </a>
          <span className="text-retro-gray mx-2">|</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="bg-retro-black text-retro-yellow py-1.5 overflow-hidden relative z-10 border-y border-retro-yellow" aria-label="Malaysian news ticker">
      <span className="absolute left-0 top-0 bottom-0 bg-retro-yellow text-retro-black text-xs font-bold px-2 flex items-center z-10" aria-hidden="true">
        MY NEWS
      </span>

      <div className="pl-20 overflow-hidden">
        <div
          ref={trackRef}
          className="flex whitespace-nowrap text-xs font-mono will-change-transform"
          style={{ transform: "translateX(0) translateZ(0)" }}
          data-offset="0"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="inline-flex items-center gap-1 shrink-0">
            {tickerItems}
          </span>
          <span className="inline-flex items-center gap-1 shrink-0" aria-hidden="true">
            {tickerItems}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(NewsTicker);
