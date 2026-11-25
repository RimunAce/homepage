"use client";

import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import SafeImage from "../SafeImage";
import styles from "./music.module.css";

const EQUALIZER_BARS = [
  { active: [4, 16, 8, 12, 4], duration: 0.5 },
  { active: [8, 4, 16, 10, 8], duration: 0.4 },
  { active: [12, 8, 4, 16, 12], duration: 0.6 },
];

export default function Playlist() {
    const reduceMotion = useReducedMotion();
    const {
        tracks,
        currentTrack,
        setCurrentTrack,
        setIsPlaying,
        setCurrentTime,
        isMikuMode,
        setIsMikuMode,
        isPlaying,
        isLoading,
        playlistUnavailable,
    } = useMusicPlayer();

    const handleTrackClick = (index: number) => {
        setCurrentTrack(index);
        setIsPlaying(true);
        setCurrentTime(0);
    };

    const handleTabSwitch = (isMiku: boolean) => {
        setIsMikuMode(isMiku);
    };

    return (
        <section aria-label="Playlist" className={styles.playlist}>
            <header className={styles.playlistHeader}>
                <h2>Playlist</h2>
                <div className={styles.modeTabs}>
                    <div className={styles.modeButtons} role="group" aria-label="Playlist mode">
                        <button
                            type="button"
                            onClick={() => handleTabSwitch(false)}
                            aria-pressed={!isMikuMode}
                            className={styles.modeButton}
                        >
                            Teto
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabSwitch(true)}
                            aria-pressed={isMikuMode}
                            className={styles.modeButton}
                        >
                            +Miku
                        </button>
                    </div>
                    <motion.div
                        className={`${styles.modeIndicator} ${isMikuMode ? styles.mikuIndicator : ""}`}
                        initial={false}
                        animate={{ left: isMikuMode ? "50%" : "0%", width: "50%" }}
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                        aria-hidden="true"
                    />
                </div>
            </header>

            <div className={styles.playlistContent}>
                <AnimatePresence mode="wait">
                    <motion.ul
                        key={isMikuMode ? "miku" : "teto"}
                        initial={{ opacity: 0, x: isMikuMode ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isMikuMode ? -20 : 20 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                        className={styles.trackList}
                    >
                        {isLoading && (
                            <li className={styles.listState} role="status" aria-live="polite">Loading playlist.</li>
                        )}
                        {!isLoading && playlistUnavailable && tracks.length === 0 && (
                            <li className={styles.listError} role="alert">
                                <p>
                                    Could not load this playlist right now. Try again later.
                                </p>
                            </li>
                        )}
                        {!isLoading && !playlistUnavailable && tracks.length === 0 && (
                            <li className={styles.listState}>No tracks in this playlist.</li>
                        )}
                        {tracks.map((track, index) => (
                            <li key={track.id}>
                                <button
                                    type="button"
                                    onClick={() => handleTrackClick(index)}
                                    aria-pressed={currentTrack === index}
                                    className={`${styles.trackButton} ${currentTrack === index ? styles.selectedTrack : ""}`}
                                >
                                    <div className={styles.trackArtwork}>
                                        <SafeImage
                                            src={track.thumbnail}
                                            alt=""
                                            width={48}
                                            height={48}
                                            sizes="48px"
                                            className="h-full w-full object-cover"
                                            fallbackLabel="No cover"
                                        />
                                    </div>

                                    <div className={styles.trackCopy}>
                                        <span className={styles.trackName}>{track.title}</span>
                                        <span className={styles.trackArtist}>
                                            {track.author}
                                        </span>
                                    </div>

                                    {currentTrack === index && (
                                        <div className={styles.equalizer} aria-hidden="true">
                                            {EQUALIZER_BARS.map((bar, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={isPlaying && !reduceMotion ? { height: bar.active } : { height: isPlaying ? 10 : 4 }}
                                                    transition={isPlaying && !reduceMotion
                                                        ? { repeat: Infinity, duration: bar.duration, ease: "linear" }
                                                        : { duration: 0 }}
                                                    className={styles.equalizerBar}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                </AnimatePresence>
            </div>
        </section>
    );
}
