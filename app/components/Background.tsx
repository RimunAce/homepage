"use client";

import { useEffect, useRef, useCallback } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const lastDrawRef = useRef(0);

  // Throttled draw function - only redraws when cursor moves
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFB6C1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 40;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 1.5
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      
      // Throttle redraws to ~30fps for cursor effect
      const now = performance.now();
      if (now - lastDrawRef.current > 33) {
        lastDrawRef.current = now;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(); // Redraw on resize
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [draw]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Fog Layers - Using CSS animations for GPU acceleration */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Single optimized fog layer using CSS animation */}
        <div
          className="absolute w-[200%] h-full fog-layer-1"
          style={{ 
            opacity: 0.25,
            willChange: "transform",
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[600px] h-[400px] bg-white rounded-full"
              style={{
                left: `${i * 50}%`,
                top: `${20 + (i % 2) * 30}%`,
                filter: "blur(60px)",
                transform: "translateZ(0)",
              }}
            />
          ))}
        </div>

        {/* Second fog layer */}
        <div
          className="absolute w-[200%] h-full fog-layer-2"
          style={{ 
            opacity: 0.15,
            willChange: "transform",
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[500px] h-[350px] bg-white rounded-full"
              style={{
                left: `${i * 66}%`,
                top: `${40 + (i % 2) * 20}%`,
                filter: "blur(50px)",
                transform: "translateZ(0)",
              }}
            />
          ))}
        </div>
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

      {/* CSS Animations for fog - much more performant than JS */}
      <style jsx>{`
        @keyframes fogMove1 {
          0% { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-50%) translateZ(0); }
        }
        @keyframes fogMove2 {
          0% { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-50%) translateZ(0); }
        }
        .fog-layer-1 {
          animation: fogMove1 60s linear infinite;
        }
        .fog-layer-2 {
          animation: fogMove2 45s linear infinite;
        }
      `}</style>
    </>
  );
}
