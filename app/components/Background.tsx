"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
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

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Fog Layers - Multiple layers with different speeds */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Fog Layer 1 - Slow */}
        <motion.div
          className="absolute w-[200%] h-full"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          style={{ filter: "blur(40px)", opacity: 0.3 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[500px] h-[300px] bg-white rounded-full"
              style={{
                left: `${i * 25}%`,
                top: `${20 + (i % 2) * 30}%`,
                transform: `scale(${1 + (i % 2) * 0.5})`,
              }}
            />
          ))}
        </motion.div>

        {/* Fog Layer 2 - Medium */}
        <motion.div
          className="absolute w-[200%] h-full"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          style={{ filter: "blur(30px)", opacity: 0.2 }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[400px] h-[250px] bg-white rounded-full"
              style={{
                left: `${i * 20}%`,
                top: `${30 + (i % 3) * 20}%`,
                transform: `scale(${1.2 + (i % 2) * 0.3})`,
              }}
            />
          ))}
        </motion.div>

        {/* Fog Layer 3 - Fast */}
        <motion.div
          className="absolute w-[200%] h-full"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          style={{ filter: "blur(50px)", opacity: 0.15 }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[600px] h-[350px] bg-white rounded-full"
              style={{
                left: `${i * 17.5}%`,
                top: `${10 + (i % 4) * 25}%`,
                transform: `scale(${0.8 + (i % 3) * 0.4})`,
              }}
            />
          ))}
        </motion.div>
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
    </>
  );
}
