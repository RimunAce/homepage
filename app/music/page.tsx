"use client";

import FullPlayer from "../components/MusicPage/FullPlayer";
import Playlist from "../components/MusicPage/Playlist";
import styles from "../components/MusicPage/music.module.css";

export default function MusicPage() {
    return (
        <main id="main-content" tabIndex={-1} className={`${styles.music} relative z-10 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:py-8`}>
            <div className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-8">
                <header className={styles.intro}>
                    <h1>Music</h1>
                    <span>Respire’s listening room</span>
                </header>
                <div className={styles.layout}>
                    <div className={styles.playerColumn}>
                        <FullPlayer />
                    </div>
                    <div className={styles.playlistColumn}>
                        <Playlist />
                    </div>
                </div>
            </div>
        </main>
    );
}
