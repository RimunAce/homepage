"use client";

import FullPlayer from "../components/MusicPage/FullPlayer";
import Playlist from "../components/MusicPage/Playlist";

export default function MusicPage() {
    return (
        <main id="main-content" tabIndex={-1} className="px-4 py-6 sm:py-8 pb-8 relative z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
            <div className="max-w-6xl mx-auto">
                <h1 className="retro-heading text-2xl mb-6">MUSIC</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start">
                    <div>
                        <FullPlayer />
                    </div>
                    <div>
                        <Playlist />
                    </div>
                </div>
            </div>
        </main>
    );
}
