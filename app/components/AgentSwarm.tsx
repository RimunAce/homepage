"use client";

import SwarmFinale from "./SwarmFinale";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./AgentSwarm.module.css";

const storageKey = "respire_agent_swarm";
const reducedMotion = "(prefers-reduced-motion: reduce)";
const agents = ["#c9b780", "#f2f3f6", "#c9b780", "#f2f3f6", "#c9b780", "#f2f3f6"];
let seenInMemory = false;

function showIntro() {
  if (window.matchMedia(reducedMotion).matches) return false;
  if (process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("swarm")) return true;
  if (seenInMemory) return false;
  try {
    return window.localStorage.getItem(storageKey) === null;
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  const preference = window.matchMedia(reducedMotion);
  preference.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    preference.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

const hideOnServer = () => false;

type Point = { x: number; y: number };

export default function AgentSwarm({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const eligible = useSyncExternalStore(subscribe, showIntro, hideOnServer);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);
  const active = eligible && !finished;
  const tools = useRef<(HTMLDivElement | null)[]>([]);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const [finaleOrigins, setFinaleOrigins] = useState<Point[] | null>(null);
  const [total, setTotal] = useState(0);
  const [built, setBuilt] = useState(0);
  const site = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const animationControl = useRef<{ pause: () => void; resume: () => void } | null>(null);

  const finishIntro = useCallback(() => {
    seenInMemory = true;
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Storage can become unavailable during the intro.
    }
    setFinished(true);
  }, []);

  const togglePause = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) animationControl.current?.pause();
    else animationControl.current?.resume();
  }, []);

  useEffect(() => {
    if (!active) return;
    const root = site.current;
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-swarm-step], [data-swarm-route]:not(:has([data-swarm-step]))"));

    const previousFocus = document.activeElement;
    const html = document.documentElement;
    const overflow = html.style.overflow;

    html.style.overflow = "hidden";
    overlay.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishIntro();
      if (event.key !== "Tab" || !overlay.current) return;

      const focusable = Array.from(
        overlay.current.querySelectorAll<HTMLElement>('button:not([disabled])'),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === overlay.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Each worker owns a queue. A short section can finish while its neighbours are still drawing.
    const workers = agents.map((_, worker) => elements.filter((_, i) => i % agents.length === worker));
    const boxes = new Map<HTMLElement, DOMRect>();
    let measure = true;
    let viewportWidth = innerWidth;
    let viewportHeight = innerHeight;
    const invalidate = () => { measure = true; };
    const observer = new ResizeObserver(invalidate);
    observer.observe(root);
    elements.forEach(element => observer.observe(element));
    window.addEventListener("resize", invalidate);
    window.addEventListener("scroll", invalidate);

    const ease = (value: number) => {
      const t = Math.min(1, Math.max(0, value));
      return t * t * (3 - 2 * t);
    };
    let frameId = 0;
    let started = performance.now();
    let pausedAt: number | null = null;
    const jobs = workers.map((queue, i) => ({
      queue, index: 0, departed: started, start: started + 75 * i,
      from: { x: viewportWidth * (i + 0.5) / agents.length, y: 5 },
    }));
    const positions = jobs.map(job => job.from);
    let visibleBoxes: DOMRect[] = [];
    let previousTime = started;
    setTotal(elements.length);

    const scheduleDraw = () => {
      if (pausedRef.current || frameId !== 0) return;
      frameId = requestAnimationFrame(draw);
    };

    const draw = (now: number) => {
      frameId = 0;
      if (pausedRef.current) return;
      if (measure) {
        viewportWidth = innerWidth;
        viewportHeight = innerHeight;
        elements.forEach(element => boxes.set(element, element.getBoundingClientRect()));
        visibleBoxes = Array.from(boxes.values()).filter(r =>
          Math.min(r.right, viewportWidth) - Math.max(0, r.left) > 2 &&
          Math.min(r.bottom, viewportHeight) - Math.max(0, r.top) > 2);
        measure = false;
      }
      const delta = Math.max(0, now - previousTime);
      const follow = 1 - Math.exp(-delta / 95);
      previousTime = now;
      const pending = jobs.map(job => boxes.get(job.queue[job.index]));
      const activeBoxes = visibleBoxes.filter(box => pending.includes(box));
      const inspectionBoxes = activeBoxes.length ? activeBoxes : visibleBoxes;
      for (const [i, job] of jobs.entries()) {
        const element = job.queue[job.index];
        const pen = tools.current[i];
        const frame = frames.current[i];
        const r = boxes.get(element);
        if (!pen || !frame) continue;
        const age = now - job.start;
        const visible = r && visibleBoxes.includes(r);
        const height = visible ? Math.min(viewportHeight, r.bottom) - Math.max(0, r.top) : 0;
        const duration = visible ? 1050 + Math.min(650, height) : 480;
        const progress = Math.min(1, Math.max(0, (age - 440) / duration));
        let x = positions[i].x;
        let y = positions[i].y;
        if (visible) {
          const left = Math.max(0, r.left);
          const top = Math.max(0, r.top);
          const right = Math.min(viewportWidth, r.right);
          const width = right - left;
          // Pull away from the viewport edge so the cursor stays visible during the downward stroke.
          const reverse = right > viewportWidth - 32;
          frame.toggleAttribute("data-reverse", reverse);
          const grip = reverse ? right : left;
          const action = age < 440 ? "travel" : progress < 0.92 ? "draw" : "set";
          if (pen.dataset.action !== action) pen.dataset.action = action;
          if (age < 440) {
            const arrival = ease((now - job.departed) / (440 + job.start - job.departed));
            const dx = grip - job.from.x;
            const dy = top - job.from.y;
            const length = Math.hypot(dx, dy);
            const arc = 4 * arrival * (1 - arrival) * Math.min(0.18, 64 / Math.max(1, length)) * (i % 2 ? 1 : -1);
            x = job.from.x + dx * arrival - dy * arc;
            y = job.from.y + dy * arrival + dx * arc;
            frame.style.opacity = "0";
          } else {
            const inkWidth = width * ease(progress / 0.43);
            const lip = Math.min(14, height * 0.18);
            const inkHeight = lip * (inkWidth / width) + (height - lip) * ease((progress - 0.43) / 0.57);
            x = grip + (reverse ? -inkWidth : inkWidth);
            y = top + inkHeight;
            const inkLeft = reverse ? x : grip;
            const inkRight = reverse ? grip : x;
            frame.style.left = `${inkLeft}px`;
            frame.style.top = `${top}px`;
            frame.style.width = `${inkWidth}px`;
            frame.style.height = `${inkHeight}px`;
            frame.style.opacity = String(1 - ease((progress - 0.92) / 0.08));
            if (!element.hasAttribute("data-swarm-working")) element.setAttribute("data-swarm-working", "");
            element.style.clipPath = `inset(0 ${r.right - inkRight}px ${r.bottom - y}px ${inkLeft - r.left}px)`;
          }
        } else {
          // Free hands check a visible seam, including when their own job is below the fold.
          const seam = inspectionBoxes[i % Math.max(1, inspectionBoxes.length)];
          const left = Math.max(4, seam?.left ?? 0);
          const right = Math.max(left, Math.min(viewportWidth - 28, seam?.right ?? viewportWidth));
          const t = (now - started) / 520 + i * Math.PI / 3;
          const targetX = left + (right - left) * (0.5 + 0.44 * Math.sin(t));
          const edge = i % 2 ? seam?.top : seam?.bottom;
          const targetY = Math.min(viewportHeight - 32, Math.max(5, edge ?? viewportHeight / 2));
          const dx = targetX - x;
          const dy = targetY - y;
          const fraction = Math.min(follow, delta * 1.45 / Math.max(1, Math.hypot(dx, dy)));
          x += dx * fraction;
          y += dy * fraction;
          job.from = { x, y };
          pen.dataset.action = "inspect";
          frame.removeAttribute("data-reverse");
          frame.style.left = `${Math.max(0, x - 18)}px`;
          frame.style.top = `${y}px`;
          frame.style.width = "18px";
          frame.style.height = "2px";
          frame.style.opacity = Math.abs(y - targetY) < 5 ? "0.85" : "0";
        }
        x = Math.max(0, Math.min(viewportWidth - 8, x));
        y = Math.max(0, Math.min(viewportHeight - 8, y));
        positions[i] = { x, y };
        pen.style.transform = `translate3d(${x}px,${y}px,0)`;
        pen.style.opacity = "1";
        if (element && progress === 1) {
          element.setAttribute("data-swarm-built", "");
          element.removeAttribute("data-swarm-working");
          element.style.removeProperty("clip-path");
          frame.style.opacity = "0";
          job.index++;
          job.from = positions[i];
          job.departed = now;
          job.start = now + 120;
          setBuilt(count => count + 1);
        }
      }
      if (jobs.some(job => job.index < job.queue.length)) {
        scheduleDraw();
      } else {
        animationControl.current = null;
        setFinaleOrigins(positions);
      }
    };
    animationControl.current = {
      pause: () => {
        pausedAt = performance.now();
        if (frameId !== 0) cancelAnimationFrame(frameId);
        frameId = 0;
      },
      resume: () => {
        if (pausedAt !== null) {
          const pauseDuration = performance.now() - pausedAt;
          started += pauseDuration;
          jobs.forEach((job) => {
            job.start += pauseDuration;
            job.departed += pauseDuration;
          });
          previousTime = performance.now();
          pausedAt = null;
        }
        scheduleDraw();
      },
    };
    scheduleDraw();
    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      animationControl.current = null;
      observer.disconnect();
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("keydown", onKeyDown);
      elements.forEach(element => {
        element.style.removeProperty("clip-path");
        element.removeAttribute("data-swarm-working");
      });
      elements.forEach((element) => element.removeAttribute("data-swarm-built"));
      html.style.overflow = overflow;

      if (previousFocus instanceof HTMLElement && previousFocus !== document.body) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [active, pathname, finishIntro]);

  return (
    <>
      <div ref={site} inert={active} className={active ? styles.building : undefined}>
        {children}
      </div>
      {active && (
        <div ref={overlay} tabIndex={-1} className={styles.overlay} data-paused={paused || undefined} role="group"
          aria-label={finaleOrigins ? "Welcome to respire.my" : "Building respire.my"}>
          {finaleOrigins ? (
            <>
              <p className={styles.story} aria-live="polite">The room is yours now.</p>
              <SwarmFinale colors={agents} origins={finaleOrigins} onFinish={finishIntro} paused={paused} />
            </>
          ) : (
            <>
              <div className={styles.progress} aria-hidden="true">
                <span>{built < total ? "Making a little room for you" : "Everything’s in place"}</span>
                <span className={styles.stamps}>
                  {Array.from({ length: total }, (_, i) => (
                    <i key={i} className={i < built ? styles.stamped : undefined} />
                  ))}
                </span>
              </div>
              <p className={styles.story} aria-live="polite">
                {built < total ? "A diary, favorite things, and whatever comes next." : "Come on in, Respire’s corner is ready."}
              </p>
              <div aria-hidden="true">
                {agents.map((color, index) => (
                  <div key={`worker-${index}`} style={{ color }}>
                    <div ref={node => { frames.current[index] = node; }} className={styles.frame} />
                    <div ref={node => { tools.current[index] = node; }} className={styles.pen}>
                      <span className={styles.cursor}><span /></span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className={styles.actions}>
            <button type="button" className={styles.skip} onClick={togglePause} aria-pressed={paused}>
              {paused ? "Resume intro" : "Pause intro"}
            </button>
            <button type="button" className={styles.skip} onClick={finishIntro}>Skip intro</button>
          </div>
        </div>
      )}
    </>
  );
}
