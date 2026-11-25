"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import styles from "./music.module.css";

export default function Visualizer() {
    const { isPlaying } = useMusicPlayer();
    const reduceMotion = useReducedMotion();
    const heights = useMemo(() => Array.from({ length: 20 }, (_, i) => ((i * 37) % 64) + 16), []);

    return (
        <div className={styles.visualizer} role="img" aria-label={isPlaying ? "Music visualizer, playing" : "Music visualizer, paused"}>
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className={styles.visualizerBar}
                    initial={false}
                    animate={
                        reduceMotion
                            ? { height: isPlaying ? heights[i] : 4 }
                            : isPlaying
                            ? {
                                height: [
                                    heights[i],
                                    heights[(i + 7) % heights.length],
                                    heights[(i + 13) % heights.length],
                                ],
                            }
                            : { height: 4 }
                    }
                    transition={reduceMotion ? { duration: 0 } : {
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
