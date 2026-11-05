"use client";

import { useEffect, useRef, memo } from "react";

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
      ctx.fillStyle = "#FFB6C1";
      ctx.fillRect(0, 0, width, height);

      const gridSize = 40;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.6)");
      ctx.fillStyle = vignette;
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
      cursorGradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      cursorGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
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

      {/* Simplified fog using CSS animations - GPU accelerated */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div
          className="fog-layer fog-layer-1"
          style={{
            position: "absolute",
            width: "200%",
            height: "100%",
            background:
              "radial-gradient(ellipse 600px 300px at 25% 50%, rgba(255,255,255,0.2) 0%, transparent 70%), " +
              "radial-gradient(ellipse 500px 250px at 75% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)",
            animation: "fogMove 60s linear infinite",
            willChange: "transform",
          }}
        />
        <div
          className="fog-layer fog-layer-2"
          style={{
            position: "absolute",
            width: "200%",
            height: "100%",
            background:
              "radial-gradient(ellipse 400px 200px at 40% 70%, rgba(255,255,255,0.15) 0%, transparent 70%), " +
              "radial-gradient(ellipse 450px 220px at 80% 40%, rgba(255,255,255,0.1) 0%, transparent 70%)",
            animation: "fogMove 45s linear infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* Watermark Text */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <div className="text-[20vw] font-bold text-white opacity-5 whitespace-nowrap select-none">
          respire.my
        </div>
      </div>

      <style jsx>{`
        @keyframes fogMove {
          from {
            transform: translateX(0) translateZ(0);
          }
          to {
            transform: translateX(-50%) translateZ(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .fog-layer {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default memo(Background);
