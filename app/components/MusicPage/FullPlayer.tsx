"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

export default function FullPlayer() {
    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        togglePlayPause,
        nextTrack,
        prevTrack,
        handleSeek,
        setVolume,
        formatTime,
        getCurrentTitle,
        getCurrentAuthor,
        getCurrentThumbnail,
    } = useMusicPlayer();

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            {/* Album Art */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-64 h-64 md:w-80 md:h-80 mb-8 border-4 border-retro-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-retro-gray"
            >
                {getCurrentThumbnail() ? (
                    <Image
                        src={getCurrentThumbnail()}
                        alt="Album Art"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                        🎵
                    </div>
                )}
            </motion.div>

            {/* Track Info */}
            <div className="text-center mb-8 space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold truncate max-w-xs md:max-w-md mx-auto">
                    {getCurrentTitle()}
                </h2>
                <p className="text-lg text-gray-600 truncate max-w-xs md:max-w-md mx-auto">
                    {getCurrentAuthor()}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-8">
                <div className="flex justify-between text-sm font-mono mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="relative h-4 bg-retro-gray border-2 border-retro-black">
                    <div
                        className="h-full bg-retro-black transition-all duration-100"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-8 mb-8">
                <button
                    onClick={prevTrack}
                    className="p-4 border-2 border-retro-black bg-retro-white hover:bg-retro-black hover:text-retro-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                    </svg>
                </button>

                <button
                    onClick={togglePlayPause}
                    className="p-6 border-2 border-retro-black bg-retro-white hover:bg-retro-black hover:text-retro-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    {isPlaying ? (
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    ) : (
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    )}
                </button>

                <button
                    onClick={nextTrack}
                    className="p-4 border-2 border-retro-black bg-retro-white hover:bg-retro-black hover:text-retro-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                </button>
            </div>

            {/* Volume */}
            <div className="w-full max-w-xs flex items-center space-x-4">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <div className="flex-1 relative h-2 bg-retro-gray border border-retro-black">
                    <div
                        className="h-full bg-retro-black"
                        style={{ width: `${volume * 100}%` }}
                    />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
