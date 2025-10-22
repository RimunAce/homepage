"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMusicPlayer } from "../contexts/MusicPlayerContext";
import ToggleButton from "./MusicPlayer/ToggleButton";
import MikuToggleButton from "./MusicPlayer/MikuToggleButton";
import TrackDisplay from "./MusicPlayer/TrackDisplay";
import ProgressBar from "./MusicPlayer/ProgressBar";
import PlayerControls from "./MusicPlayer/PlayerControls";
import TrackPlaylist from "./MusicPlayer/TrackPlaylist";

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

  if (isLoading) return null;

  const currentTrackData = tracks[currentTrack];

  return (
    <>
      <audio ref={audioRef} src={getCurrentAudio()} preload="metadata">
        <track kind="captions" />
      </audio>
      <ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-retro-white border-t-4 border-retro-black"
            style={{ boxShadow: "0 -8px 0px #000000" }}
          >
            <div className="max-w-6xl mx-auto p-4 md:p-6">
              {/* Miku Mode Toggle */}
              <div className="mb-6">
                <MikuToggleButton
                  isMikuMode={isMikuMode}
                  onClick={() => setIsMikuMode(!isMikuMode)}
                />
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
