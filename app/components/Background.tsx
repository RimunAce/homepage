"use client";

import { useEffect, useRef, memo } from "react";
import styles from "./webring.module.css";

function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let sizedWidth = 0;
    let sizedHeight = 0;
    let sizedDpr = 0;

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (width !== sizedWidth || height !== sizedHeight || dpr !== sizedDpr) {
        sizedWidth = width;
        sizedHeight = height;
        sizedDpr = dpr;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#090b10";
      ctx.fillRect(0, 0, width, height);
      if (reduceMotion.matches) return;

      const cursorGradient = ctx.createRadialGradient(
        cursorRef.current.x,
        cursorRef.current.y,
        0,
        cursorRef.current.x,
        cursorRef.current.y,
        200
      );
      cursorGradient.addColorStop(0, "rgba(112, 132, 181, 0.12)");
      cursorGradient.addColorStop(1, "rgba(112, 132, 181, 0)");
      ctx.fillStyle = cursorGradient;
      ctx.fillRect(0, 0, width, height);
    };

    const onMove = (event: MouseEvent) => {
      if (reduceMotion.matches) return;
      cursorRef.current = { x: event.clientX, y: event.clientY };
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = null;
        draw();
      });
    };

    draw();
    window.addEventListener("resize", draw, { passive: true });
    reduceMotion.addEventListener("change", draw);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("resize", draw);
      window.removeEventListener("mousemove", onMove);
      reduceMotion.removeEventListener("change", draw);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div
          className="fog-layer fog-layer-1"
          style={{
            position: "absolute",
            width: "34rem",
            height: "34rem",
            left: "-10rem",
            top: "8rem",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(105,66,126,.18) 0%, rgba(105,66,126,0) 70%)",
            filter: "blur(26px)",
          }}
        />
        <div
          className="fog-layer fog-layer-2"
          style={{
            position: "absolute",
            width: "40rem",
            height: "40rem",
            right: "-14rem",
            bottom: "-18rem",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(46,103,116,.16) 0%, rgba(46,103,116,0) 72%)",
            filter: "blur(32px)",
          }}
        />
      </div>
      <div className={styles.sky} aria-hidden="true" />
    </>
  );
}

export default memo(Background);
