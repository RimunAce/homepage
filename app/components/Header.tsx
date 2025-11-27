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

            {/* Scrolling Text Banner */}
            <div className="bg-retro-black text-retro-white py-1 overflow-hidden relative z-10">
                <motion.div
                    className="flex whitespace-nowrap text-xs font-mono"
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                    }}
                >
                    {Array.from({ length: 40 }, (_, i) => i).map((id) => (
                        <span key={`banner-${id}`} className="mx-4">
                            WE ARE NOT FINISHED //
                        </span>
                    ))}
                </motion.div>
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
