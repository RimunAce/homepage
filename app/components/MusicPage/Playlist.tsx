"use client";

import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Playlist() {
    const {
        tracks,
        currentTrack,
        setCurrentTrack,
        setIsPlaying,
        setCurrentTime,
        isMikuMode,
        setIsMikuMode
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
        <div className="w-full max-w-md mx-auto border-2 border-retro-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Tab Header */}
            <div className="relative border-b-2 border-retro-black">
                <div className="flex">
                    <button
                        onClick={() => handleTabSwitch(false)}
                        className={`flex-1 py-3 px-4 font-bold text-lg transition-all relative ${!isMikuMode
                            ? "text-retro-black"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        Teto
                    </button>
                    <button
                        onClick={() => handleTabSwitch(true)}
                        className={`flex-1 py-3 px-4 font-bold text-lg transition-all relative ${isMikuMode
                            ? "text-retro-black"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        +Miku
                    </button>
                </div>
                {/* Animated Tab Indicator */}
                <motion.div
                    className="absolute bottom-0 h-1 bg-retro-black"
                    initial={false}
                    animate={{
                        left: isMikuMode ? "50%" : "0%",
                        width: "50%"
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                />
            </div>

            {/* Playlist Content */}
            <div className="h-[400px] overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                    <motion.ul
                        key={isMikuMode ? "miku" : "teto"}
                        initial={{ opacity: 0, x: isMikuMode ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isMikuMode ? -20 : 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        {tracks.map((track, index) => (
                            <li key={track.id}>
                                <button
                                    onClick={() => handleTrackClick(index)}
                                    className={`w-full text-left p-3 border border-retro-black transition-all flex items-center gap-3 group ${currentTrack === index
                                        ? "bg-retro-black text-retro-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                        : "bg-retro-white hover:bg-gray-100 hover:translate-x-1"
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0 w-12 h-12 border-2 border-retro-black overflow-hidden bg-gray-200">
                                        <Image
                                            src={track.thumbnail}
                                            alt={track.title}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Track Info */}
                                    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                                        <span className="font-bold truncate">{track.title}</span>
                                        <span
                                            className={`text-sm truncate ${currentTrack === index ? "text-gray-300" : "text-gray-600"
                                                }`}
                                        >
                                            {track.author}
                                        </span>
                                    </div>

                                    {/* Playing Indicator */}
                                    {currentTrack === index && (
                                        <div className="flex space-x-1 items-end h-4 ml-2 flex-shrink-0">
                                            <motion.div
                                                animate={{ height: [4, 16, 8, 12, 4] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.5,
                                                    ease: "linear",
                                                }}
                                                className="w-1 bg-retro-white"
                                            />
                                            <motion.div
                                                animate={{ height: [8, 4, 16, 10, 8] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.4,
                                                    ease: "linear",
                                                }}
                                                className="w-1 bg-retro-white"
                                            />
                                            <motion.div
                                                animate={{ height: [12, 8, 4, 16, 12] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.6,
                                                    ease: "linear",
                                                }}
                                                className="w-1 bg-retro-white"
                                            />
                                        </div>
                                    )}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                </AnimatePresence>
            </div>
        </div>
    );
}
