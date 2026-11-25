"use client";

import { motion, useReducedMotion } from "framer-motion";
import SafeImage from "../SafeImage";
import { type ChangeEventHandler, type ReactNode } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { PreviousIcon, NextIcon, PlayPauseIcon, VolumeIcon } from "../MusicPlayer/icons";
import Visualizer from "./Visualizer";
import styles from "./music.module.css";

const BASE_BUTTON_CLASS = styles.controlButton;
const SMALL_BUTTON_CLASS = `min-h-14 min-w-14 p-3 ${BASE_BUTTON_CLASS}`;
const LARGE_BUTTON_CLASS = `min-h-16 min-w-16 p-4 sm:min-h-20 sm:min-w-20 ${BASE_BUTTON_CLASS}`;
const TRACK_TEXT_CLASS = "truncate max-w-xs md:max-w-md mx-auto";

interface ControlButtonProps {
  onClick: () => void;
  className: string;
  children: ReactNode;
  label?: string;
  pressed?: boolean;
  disabled?: boolean;
}

const ControlButton = ({ onClick, className, children, label, pressed, disabled }: ControlButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={className}
    aria-label={label}
    aria-pressed={pressed}
    disabled={disabled}
  >
    {children}
  </button>
);

const AlbumArt = ({ thumbnail, title }: { thumbnail: string; title: string | undefined }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
      className={`${styles.albumArt} relative mb-6 h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72`}
    >
      {thumbnail ? (
        <SafeImage
          src={thumbnail}
          alt={title ? `${title} cover` : "Album art"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 16rem, 20rem"
          priority
          fallbackLabel="No cover"
        />
      ) : (
        <div className={styles.coverPlaceholder} aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

const TrackInfo = ({ title, author }: { title: string; author: string }) => (
  <div className={`${styles.trackInfo} mb-5 space-y-2`}>
    <h2 className={`${styles.trackTitle} text-2xl md:text-3xl ${TRACK_TEXT_CLASS}`}>{title}</h2>
    <p className={`${styles.trackAuthor} text-base ${TRACK_TEXT_CLASS}`}>{author}</p>
  </div>
);

interface RangeTrackProps {
  value: number;
  max: number;
  min: number;
  step?: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className: string;
  label?: string;
  disabled?: boolean;
}

const RangeTrack = ({ value, max, min, step = 1, onChange, className, label, disabled }: RangeTrackProps) => {
  const percent = Math.min(100, Math.max(0, (value / (max || 1)) * 100));
  return (
    <div
      className={`${styles.rangeTrack} ${disabled ? styles.rangeTrackDisabled : ""} ${className}`}
    >
      <div className={styles.rangeLine}>
        <div className={styles.rangeFill} style={{ width: `${percent}%` }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        aria-label={label}
        disabled={disabled}
        className={styles.rangeInput}
      />
    </div>
  );
};

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  onSeek: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

const ProgressBar = ({ currentTime, duration, formatTime, onSeek, disabled }: ProgressBarProps) => (
  <div className={styles.progress}>
    <div className={styles.timeReadout}>
      <span>{formatTime(currentTime)}</span>
      <span>{formatTime(duration)}</span>
    </div>
    <RangeTrack
      value={currentTime}
      max={duration || 0}
      min={0}
      step={0.1}
      onChange={onSeek}
      label="Seek to position"
      className="w-full"
      disabled={disabled}
    />
  </div>
);

interface VolumeControlProps {
  volume: number;
  setVolume: (value: number) => void;
}

const VolumeControl = ({ volume, setVolume }: VolumeControlProps) => (
  <div className={styles.volumeControl}>
    <VolumeIcon />
    <RangeTrack
      value={volume}
      max={1}
      min={0}
      step={0.01}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      label="Volume"
      className="flex-1"
    />
  </div>
);

export default function FullPlayer() {
  const {
    isPlaying,
    isLoading,
    playlistUnavailable,
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

  const title = getCurrentTitle() ?? "";
  const author = getCurrentAuthor() ?? "";
  const currentThumbnail = getCurrentThumbnail() ?? "";
  const noTrack = !title;

  return (
    <section aria-label="Music player" className={`${styles.playerSurface} flex w-full flex-col items-center p-5 sm:p-7`}>
      <AlbumArt thumbnail={currentThumbnail} title={title || undefined} />
      {isLoading ? (
        <p className={styles.stateText} role="status" aria-live="polite">Loading playlist.</p>
      ) : playlistUnavailable && noTrack ? (
        <div className={styles.playerError} role="alert">
          <p>
            Could not load this playlist right now. Try again later.
          </p>
        </div>
      ) : noTrack ? (
        <p className={styles.stateText}>No tracks in this playlist.</p>
      ) : (
        <TrackInfo title={title} author={author} />
      )}
      {!isLoading && !noTrack && <Visualizer />}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
        onSeek={handleSeek}
        disabled={noTrack}
      />

      <div className={styles.transport}>
        <ControlButton
          onClick={prevTrack}
          className={SMALL_BUTTON_CLASS}
          label="Previous track"
          disabled={noTrack}
        >
          <PreviousIcon />
        </ControlButton>
        <ControlButton
          onClick={togglePlayPause}
          className={LARGE_BUTTON_CLASS}
          label={isPlaying ? "Pause" : "Play"}
          pressed={isPlaying}
          disabled={noTrack}
        >
          <PlayPauseIcon isPlaying={isPlaying} />
        </ControlButton>
        <ControlButton
          onClick={nextTrack}
          className={SMALL_BUTTON_CLASS}
          label="Next track"
          disabled={noTrack}
        >
          <NextIcon />
        </ControlButton>
      </div>

      <VolumeControl volume={volume} setVolume={setVolume} />
    </section>
  );
}
