/// <reference lib="es2022.intl" />
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./AgentSwarm.module.css";

const greetings = [
  ["ms", "Selamat datang"], ["en", "Welcome"], ["zh", "欢迎"],
  ["hi", "स्वागत है"], ["es", "Bienvenidos"], ["ar", "أهلًا وسهلًا"],
  ["fr", "Bienvenue"], ["bn", "স্বাগতম"], ["pt", "Bem-vindos"],
  ["ru", "Добро пожаловать"], ["ja", "ようこそ"], ["id", "Selamat datang"],
  ["de", "Willkommen"], ["ko", "환영합니다"], ["ur", "خوش آمدید"],
  ["vi", "Chào mừng"], ["ta", "வரவேற்கிறோம்"], ["sw", "Karibuni"],
];

const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter() : null;
const welcomeMessages = greetings.map(([lang, word]) => ({
  lang,
  word,
  characters: segmenter
    ? Array.from(segmenter.segment(word), ({ segment }) => segment)
    : Array.from(word),
}));

type Point = { x: number; y: number };
type Phase = "gather" | "welcome" | "wave" | "pop";

const gatherMs = 620;
const wordMs = 925;
const travelMs = 245;
const waveMs = 1150;

function mix(from: Point, to: Point, t: number): Point {
  return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
}

function glide(from: Point, to: Point, t: number): Point {
  const point = mix(from, to, t * t * (3 - 2 * t));
  point.y -= Math.sin(t * Math.PI) * Math.min(32, Math.hypot(from.x - to.x, from.y - to.y) * 0.1);
  return point;
}

// Measure the printed letters once so each pen can follow proportional, wrapped and RTL text.
function measureCarets(word: HTMLElement, characters: string[]): Point[] {
  const text = word.firstChild!;
  const range = document.createRange();
  let offset = 0;
  return ["", ...characters].map(character => {
    offset += character.length;
    range.setStart(text, offset);
    range.collapse(true);
    const rect = range.getBoundingClientRect();
    return { x: rect.left, y: rect.bottom - 2 };
  });
}

export default function SwarmFinale({ colors, origins, onFinish, paused }: {
  colors: string[];
  origins: Point[];
  onFinish: () => void;
  paused: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("gather");
  const card = useRef<HTMLDivElement>(null);
  const pens = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef(paused);
  const animationControl = useRef<{ pause: () => void; resume: () => void } | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) animationControl.current?.pause();
    else animationControl.current?.resume();
  }, [paused]);

  useEffect(() => {
    const panel = card.current!;
    const words = Array.from(panel.querySelectorAll<HTMLElement>(`.${styles.word}`));
    const outputs = Array.from(panel.querySelectorAll<HTMLElement>(`.${styles.typed}`));
    let carets: Point[][] = [];
    let rings: Point[] = [];
    let landing: Point[] = [];
    let dirty = true;
    const invalidate = () => { dirty = true; };
    const observer = new ResizeObserver(invalidate);
    observer.observe(panel);
    window.addEventListener("resize", invalidate);

    const rounds = Math.ceil(words.length / colors.length);
    const waveStart = gatherMs + rounds * wordMs;
    let started = performance.now();
    let pausedAt: number | null = null;
    let request = 0;
    let current: Phase = "gather";
    const scheduleDraw = () => {
      if (pausedRef.current || request !== 0) return;
      request = requestAnimationFrame(draw);
    };

    const draw = (now: number) => {
      request = 0;
      if (pausedRef.current) return;
      const elapsed = Math.max(0, now - started);
      if (dirty) {
        carets = words.map((word, i) => measureCarets(word, welcomeMessages[i].characters));
        rings = colors.map((_, i) => {
          const angle = i * Math.PI * 2 / colors.length;
          return { x: innerWidth / 2 + Math.cos(angle) * Math.min(65, innerWidth * .09),
            y: innerHeight / 2 + Math.sin(angle) * 44 };
        });
        landing = colors.map((_, i) => ({
          x: innerWidth / 2 + (i - (colors.length - 1) / 2) * Math.min(85, innerWidth * .12),
          y: innerHeight / 2,
        }));
        dirty = false;
      }

      const stage = elapsed < gatherMs ? "gather" : elapsed < waveStart ? "welcome"
        : elapsed < waveStart + waveMs ? "wave" : "pop";
      if (stage !== current) {
        current = stage;
        setPhase(stage);
      }

      const completedRounds = Math.min(rounds, Math.max(0, Math.floor((elapsed - gatherMs) / wordMs)));
      for (let index = 0; index < completedRounds * colors.length; index++) {
        if (outputs[index].textContent !== welcomeMessages[index].word) {
          outputs[index].textContent = welcomeMessages[index].word;
        }
      }

      colors.forEach((_, i) => {
        const pen = pens.current[i]!;
        let point: Point;
        if (stage === "gather") {
          point = glide(origins[i], rings[i], elapsed / gatherMs);
        } else if (stage === "welcome") {
          const age = elapsed - gatherMs;
          const round = Math.floor(age / wordMs);
          const index = round * colors.length + i;
          const path = carets[index];
          const local = age % wordMs;
          if (local < travelMs) {
            const from = round ? carets[index - colors.length].at(-1)! : rings[i];
            point = glide(from, path[0], local / travelMs);
          } else {
            const progress = (local - travelMs) / (wordMs - travelMs) * (path.length - 1);
            const letter = Math.floor(progress);
            point = mix(path[letter], path[letter + 1], progress - letter);
            const written = welcomeMessages[index].characters.slice(0, Math.ceil(progress)).join("");
            if (outputs[index].textContent !== written) outputs[index].textContent = written;
          }
        } else {
          const last = (rounds - 1) * colors.length + i;
          const age = Math.min(waveMs, elapsed - waveStart);
          const hand = { ...landing[i], y: landing[i].y - Math.sin(age / 118 - i * .72) * 11 };
          point = glide(carets[last].at(-1)!, hand, Math.min(1, age / 480));
        }
        pen.style.transform = `translate3d(${point.x}px,${point.y}px,0)`;
      });
      if (stage !== "pop") scheduleDraw();
    };
    animationControl.current = {
      pause: () => {
        pausedAt = performance.now();
        if (request !== 0) cancelAnimationFrame(request);
        request = 0;
      },
      resume: () => {
        if (pausedAt !== null) {
          started += performance.now() - pausedAt;
          pausedAt = null;
        }
        scheduleDraw();
      },
    };
    scheduleDraw();
    return () => {
      cancelAnimationFrame(request);
      animationControl.current = null;
      observer.disconnect();
      window.removeEventListener("resize", invalidate);
    };
  }, [colors, origins]);

  useEffect(() => {
    if (phase !== "pop") return;
    let mounted = true;
    const bursts = pens.current.flatMap(pen => pen?.getAnimations({ subtree: true }) ?? []);
    Promise.allSettled(bursts.map(animation => animation.finished)).then(() => {
      if (mounted) onFinish();
    });
    return () => { mounted = false; };
  }, [phase, onFinish]);

  return (
    <div data-swarm-phase={phase} aria-hidden="true">
      <div className={styles.welcome} ref={card}>
        <strong className={styles.greeting}>Welcome, Respire.</strong>
        {welcomeMessages.map(({ lang, word }) => (
          <span key={lang} lang={lang} dir="auto">
            <span className={styles.word}>{word}</span>
            <span className={styles.typed} />
          </span>
        ))}
      </div>
      {colors.map((color, i) => (
        <div key={`${color}-${i}`} ref={node => { pens.current[i] = node; }} className={styles.agent}
          style={{ color, "--burst-delay": `${i * 10}ms`,
            transform: `translate3d(${origins[i].x}px,${origins[i].y}px,0)` } as CSSProperties}>
          {phase === "pop" ? (
            <div className={styles.bubbles}>
              {Array.from({ length: 4 }, (_, b) => <i key={b} />)}
            </div>
          ) : phase === "wave" ? (
            <span className={styles.hand}>
              <svg viewBox="0 0 40 44" width="100%" height="100%" aria-hidden="true">
                <path fill="currentColor" stroke="black" strokeWidth="2" strokeLinejoin="round"
                  d="M11 27 5 19q-4-5-1-7 2-2 5 2l4 5-5-13q-1-4 2-5 3-1 4 3l5 12-2-13q0-4 3-4 3 0 3 4l2 13 1-11q0-4 3-4 3 0 3 4l-1 13 2-6q1-4 4-3 3 1 1 6l-4 15q-3 10-12 10-7 0-11-6z"
                  transform="translate(1 2) scale(.94)" />
              </svg>
            </span>
          ) : <span className={styles.cursor}><span /></span>}
        </div>
      ))}
    </div>
  );
}
