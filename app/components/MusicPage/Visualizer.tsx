"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

export default function Visualizer() {
    const { isPlaying } = useMusicPlayer();
    const heights = useMemo(() => Array.from({ length: 20 }, (_, i) => ((i * 37) % 64) + 16), []);

    return (
        <div className="flex items-end justify-center space-x-1 h-16 mb-8">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-2 bg-retro-black"
                    animate={
                        isPlaying
                            ? {
                                height: [
                                    heights[i],
                                    heights[(i + 7) % heights.length],
                                    heights[(i + 13) % heights.length],
                                ],
                            }
                            : { height: 4 }
                    }
                    transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        ease: "linear",
                        delay: i * 0.05,
                    }}
                />
            ))}
        </div>
    );
}
