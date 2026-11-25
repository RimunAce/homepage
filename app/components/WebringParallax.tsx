"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./webring.module.css";
import { mountSpheres } from "./webring-spheres";

const phases = [3.83, 5.92, 1.73];
const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export default function WebringParallax({ children }: { children: ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const planets = Array.from(scene.querySelectorAll<HTMLElement>("[data-planet]"));
    let visible = false;
    let frame = 0;
    let lastFrame = 0;
    let angle = 0;
    let spinTime = 0;
    let paintedFrame = 0;
    let drawSpheres: ReturnType<typeof mountSpheres> | undefined;
    let x = 0;
    let y = 0;
    let pointer: { x: number; y: number } | null = null;
    let hovered: Element | null = null;
    let focused: Element | null = null;

    const schedule = () => {
      if (!visible || reduced.matches || frame) return;
      frame = requestAnimationFrame((now) => {
        frame = 0;
        const dt = lastFrame ? Math.min(.05, (now - lastFrame) / 1000) : 1 / 60;
        lastFrame = now;
        if (scene.parentElement?.dataset.paused === "true") {
          lastFrame = 0;
          return;
        }
        spinTime += dt;
        const spinFrame = Math.floor(spinTime * 24);
        if (spinFrame !== paintedFrame) {
          drawSpheres?.(spinTime);
          paintedFrame = spinFrame;
        }
        const bounds = scene.getBoundingClientRect();
        const scroll = clamp((innerHeight / 2 - bounds.top - bounds.height / 2) / Math.max(1, innerHeight / 2));
        if (!hovered && !focused) {
          const ease = 1 - Math.exp(-dt * 8);
          const pointerX = pointer ? clamp((pointer.x - bounds.left) / bounds.width * 2 - 1) : 0;
          const pointerY = pointer ? clamp((pointer.y - bounds.top) / bounds.height * 2 - 1) : 0;
          x += (pointerX * 13 - x) * ease;
          y += (pointerY * 9 + scroll * 14 - y) * ease;
          scene.style.setProperty("--orbit-x", x.toFixed(3));
          scene.style.setProperty("--orbit-y", y.toFixed(3));

          angle = (angle + dt * (2 * Math.PI / 34)) % (2 * Math.PI);
          planets.forEach((planet, index) => {
            const phase = phases[index] + angle;
            const depth = Math.sin(phase);
            planet.style.setProperty("--left", `${50 + 34 * Math.cos(phase)}%`);
            planet.style.setProperty("--top", `${48 + 30 * depth}%`);
            planet.style.setProperty("--orbit-scale", String(1 + .19 * depth));
            planet.style.setProperty("--orbit-lighting", String(.86 + .14 * depth));
            planet.style.setProperty("--orbit-layer", depth >= 0 ? "2" : "0");
          });
        }
        schedule();
      });
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      hovered = event.target instanceof Element ? event.target.closest("[data-planet]") : null;
    };
    const leave = () => {
      pointer = null;
      hovered = null;
    };
    const focusChanged = (event: FocusEvent) => {
      const target = event.type === "focusin" ? event.target : event.relatedTarget;
      focused = target instanceof Element && scene.contains(target)
        ? target.closest("[data-planet]:focus-visible")
        : null;
    };
    const preference = () => {
      if (reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = 0;
        x = 0;
        y = 0;
        angle = 0;
        spinTime = 0;
        paintedFrame = 0;
        drawSpheres?.(0);
        scene.style.removeProperty("--orbit-x");
        scene.style.removeProperty("--orbit-y");
        planets.forEach((planet) => planet.removeAttribute("style"));
      } else {
        schedule();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      scene.toggleAttribute("data-in-view", visible);
      if (visible) {
        if (!reduced.matches) scene.setAttribute("data-arrived", "");
        if (!drawSpheres) {
          drawSpheres = mountSpheres(scene.closest("section") ?? scene);
          drawSpheres(0);
        }
        schedule();
      }
      else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = 0;
        pointer = null;
        hovered = null;
      }
    });
    observer.observe(scene);
    scene.addEventListener("pointermove", move, { passive: true });
    scene.addEventListener("pointerleave", leave);
    scene.addEventListener("focusin", focusChanged);
    scene.addEventListener("focusout", focusChanged);
    scene.addEventListener("orbit-resume", schedule);
    reduced.addEventListener("change", preference);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", leave);
      scene.removeEventListener("focusin", focusChanged);
      scene.removeEventListener("focusout", focusChanged);
      scene.removeEventListener("orbit-resume", schedule);
      reduced.removeEventListener("change", preference);
    };
  }, []);

  useEffect(() => {
    if (!paused) sceneRef.current?.dispatchEvent(new Event("orbit-resume"));
  }, [paused]);

  return (
    <div className={styles.orbitDisplay} data-paused={paused}>
      <div ref={sceneRef} className={styles.scene}>{children}</div>
      <button type="button" className={styles.motionControl} onClick={() => setPaused((value) => !value)}>
        {paused ? "Resume motion" : "Pause motion"}
      </button>
    </div>
  );
}
