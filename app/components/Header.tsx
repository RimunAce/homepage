"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
    return (
        <>
            {/* Header */}
            <header className="bg-retro-black text-retro-white py-2 px-4 relative z-10">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-bold">RESPIRE</h1>
                    <span className="text-sm">KASANE</span>
                </div>
            </header>

            {/* Scrolling Text Banner - CSS animation for GPU acceleration */}
            <div className="bg-retro-black text-retro-white py-1 overflow-hidden relative z-10">
                <div
                    className="flex whitespace-nowrap text-xs font-mono banner-scroll"
                    style={{ willChange: "transform" }}
                >
                    {Array.from({ length: 10 }, (_, i) => i).map((id) => (
                        <span key={`banner-${id}`} className="mx-4">
                            WE ARE NOT FINISHED //
                        </span>
                    ))}
                    {Array.from({ length: 10 }, (_, i) => i).map((id) => (
                        <span key={`banner-dup-${id}`} className="mx-4">
                            WE ARE NOT FINISHED //
                        </span>
                    ))}
                </div>
                <style jsx>{`
                    @keyframes bannerScroll {
                        0% { transform: translateX(0) translateZ(0); }
                        100% { transform: translateX(-50%) translateZ(0); }
                    }
                    .banner-scroll {
                        animation: bannerScroll 30s linear infinite;
                    }
                `}</style>
            </div>

            {/* Navigation */}
            <nav className="bg-retro-white border-b-2 border-retro-black relative z-10">
                <div className="max-w-6xl mx-auto px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                        <Link href="/" passHref legacyBehavior>
                            <motion.a
                                className="retro-button text-sm"
                                whileTap={{ scale: 0.95 }}
                            >
                                HOME
                            </motion.a>
                        </Link>
                        <Link href="/gallery" passHref legacyBehavior>
                            <motion.a
                                className="retro-button text-sm"
                                whileTap={{ scale: 0.95 }}
                            >
                                GALLERY
                            </motion.a>
                        </Link>
                        <Link href="/anilist" passHref legacyBehavior>
                            <motion.a
                                className="retro-button text-sm"
                                whileTap={{ scale: 0.95 }}
                            >
                                MY ANILIST
                            </motion.a>
                        </Link>
                        <Link href="/music" passHref legacyBehavior>
                            <motion.a
                                className="retro-button text-sm"
                                whileTap={{ scale: 0.95 }}
                            >
                                MUSIC PLAYER
                            </motion.a>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
