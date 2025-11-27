"use client";

import { motion } from "framer-motion";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

export default function Visualizer() {
    const { isPlaying } = useMusicPlayer();

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
                                    Math.random() * 64,
                                    Math.random() * 64,
                                    Math.random() * 64,
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
