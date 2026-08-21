"use client";

import FullPlayer from "../components/MusicPage/FullPlayer";
import Playlist from "../components/MusicPage/Playlist";

export default function MusicPage() {
    return (
        <main id="main-content" tabIndex={-1} className="p-4 md:p-8 pb-36 relative z-10 focus:outline-none">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
