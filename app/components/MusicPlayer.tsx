"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import ToggleButton from "./MusicPlayer/ToggleButton";
import MikuToggleButton from "./MusicPlayer/MikuToggleButton";
import TrackDisplay from "./MusicPlayer/TrackDisplay";
import ProgressBar from "./MusicPlayer/ProgressBar";
import PlayerControls from "./MusicPlayer/PlayerControls";
import TrackPlaylist from "./MusicPlayer/TrackPlaylist";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MusicPlayer() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    isOpen,
    volume,
    isMikuMode,
    audioRef,
    setCurrentTrack,
    setIsPlaying,
    setCurrentTime,
    setIsOpen,
    setVolume,
    setIsMikuMode,
    togglePlayPause,
    nextTrack,
    prevTrack,
    handleSeek,
    handleThumbnailClick,
    formatTime,
    getCurrentAudio,
    getCurrentTitle,
    getCurrentAuthor,
    getCurrentAuthorUrl,
    getCurrentThumbnail,
  } = useMusicPlayer();

  const currentTrackData = tracks[currentTrack];
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    const previous = document.getElementById("music-player-toggle");
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      <audio ref={audioRef} src={getCurrentAudio()} preload="metadata" />
      <ToggleButton
        isOpen={isOpen}
        isPlaying={isPlaying}
        isLoading={isLoading}
        title={getCurrentTitle() ?? ""}
        author={getCurrentAuthor() ?? ""}
        thumbnail={getCurrentThumbnail() ?? ""}
        onToggleDrawer={() => setIsOpen(!isOpen)}
        onTogglePlay={togglePlayPause}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            id="music-player-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Music player"
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-retro-white border-t-4 border-retro-black max-h-[85vh] overflow-y-auto retro-scrollbar"
            style={{ boxShadow: "0 -8px 0px #000000" }}
          >
            <div className="max-w-6xl mx-auto p-4 md:p-6 pb-28">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <MikuToggleButton
                  isMikuMode={isMikuMode}
                  onClick={() => setIsMikuMode(!isMikuMode)}
                />
                <Link href="/music" className="retro-link text-xs">
                  Open full player →
                </Link>
              </div>

              <motion.div
                key={isMikuMode ? "miku-content" : "teto-content"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {currentTrackData?.thumbnail && (
                  <TrackDisplay
                    currentTrack={currentTrack}
                    totalTracks={tracks.length}
                    title={getCurrentTitle()}
                    author={getCurrentAuthor()}
                    authorUrl={getCurrentAuthorUrl()}
                    thumbnail={getCurrentThumbnail()}
                    trackId={currentTrackData.id}
                    onThumbnailClick={handleThumbnailClick}
                  />
                )}
                <ProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  formatTime={formatTime}
                  onSeek={handleSeek}
                />
                <PlayerControls
                  isPlaying={isPlaying}
                  volume={volume}
                  onPrev={prevTrack}
                  onTogglePlay={togglePlayPause}
                  onNext={nextTrack}
                  onVolumeChange={setVolume}
                />
                <TrackPlaylist
                  tracks={tracks}
                  currentTrack={currentTrack}
                  onTrackSelect={(index) => {
                    setCurrentTrack(index);
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
