"use client";

import { useEffect, useRef } from "react";

export default function WebringSky() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = anchor.current?.closest("section");
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      document.body.toggleAttribute("data-webring-sky", entry.intersectionRatio >= .16);
    }, { threshold: .16 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      document.body.removeAttribute("data-webring-sky");
    };
  }, []);

  return <span ref={anchor} hidden />;
}
