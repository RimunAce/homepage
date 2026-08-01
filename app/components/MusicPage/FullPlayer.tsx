"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type ChangeEventHandler, type ReactNode } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";
import { PreviousIcon, NextIcon, PlayPauseIcon, VolumeIcon } from "../MusicPlayer/icons";

const CONTROL_SHADOW = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
const BASE_BUTTON_CLASS = `border-2 border-retro-black bg-retro-white hover:bg-retro-black hover:text-retro-white transition-colors ${CONTROL_SHADOW}`;
const SMALL_BUTTON_CLASS = `p-4 ${BASE_BUTTON_CLASS}`;
const LARGE_BUTTON_CLASS = `p-6 ${BASE_BUTTON_CLASS}`;
const TRACK_TEXT_CLASS = "truncate max-w-xs md:max-w-md mx-auto";

interface ControlButtonProps {
  onClick: () => void;
  className: string;
  children: ReactNode;
  label?: string;
  pressed?: boolean;
}

const ControlButton = ({ onClick, className, children, label, pressed }: ControlButtonProps) => (
  <button
    onClick={onClick}
    className={className}
    aria-label={label}
    aria-pressed={pressed}
  >
    {children}
  </button>
);

const AlbumArt = ({ thumbnail, title }: { thumbnail: string; title: string | undefined }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative w-64 h-64 md:w-80 md:h-80 mb-8 border-4 border-retro-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-retro-gray"
  >
    {thumbnail ? (
      <Image
        src={thumbnail}
        alt={title || "Album art"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 16rem, 20rem"
        priority
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
        </svg>
      </div>
    )}
  </motion.div>
);

const TrackInfo = ({ title, author }: { title: string; author: string }) => (
  <div className="text-center mb-8 space-y-2">
    <h2 className={`text-2xl md:text-3xl font-bold ${TRACK_TEXT_CLASS}`}>{title}</h2>
    <p className={`text-lg opacity-70 ${TRACK_TEXT_CLASS}`}>{author}</p>
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
}

const RangeTrack = ({ value, max, min, step = 1, onChange, className, label }: RangeTrackProps) => {
  const percent = (value / (max || 1)) * 100;
  return (
    <div className={className}>
      <div
        className="h-full bg-retro-black transition-all duration-100"
        style={{ width: `${percent}%` }}
      />
      <div
        className="absolute top-0 bottom-0 w-1 bg-retro-yellow"
        style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        aria-label={label}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  onSeek: ChangeEventHandler<HTMLInputElement>;
}

const ProgressBar = ({ currentTime, duration, formatTime, onSeek }: ProgressBarProps) => (
  <div className="w-full mb-8">
    <div className="flex justify-between text-sm font-mono mb-2">
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
      className="relative h-4 bg-retro-gray border-2 border-retro-black"
    />
  </div>
);

interface VolumeControlProps {
  volume: number;
  setVolume: (value: number) => void;
}

const VolumeControl = ({ volume, setVolume }: VolumeControlProps) => (
  <div className="w-full max-w-xs flex items-center space-x-4">
    <VolumeIcon />
    <RangeTrack
      value={volume}
      max={1}
      min={0}
      step={0.01}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      label="Volume"
      className="flex-1 relative h-2 bg-retro-gray border border-retro-black"
    />
  </div>
);

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

  const currentThumbnail = getCurrentThumbnail();

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <AlbumArt thumbnail={currentThumbnail} title={getCurrentTitle()} />
      <TrackInfo title={getCurrentTitle()} author={getCurrentAuthor()} />
      <ProgressBar currentTime={currentTime} duration={duration} formatTime={formatTime} onSeek={handleSeek} />

      <div className="flex items-center justify-center space-x-8 mb-8">
        <ControlButton
          onClick={prevTrack}
          className={SMALL_BUTTON_CLASS}
          label="Previous track"
        >
          <PreviousIcon />
        </ControlButton>
        <ControlButton
          onClick={togglePlayPause}
          className={LARGE_BUTTON_CLASS}
          label={isPlaying ? "Pause" : "Play"}
          pressed={isPlaying}
        >
          <PlayPauseIcon isPlaying={isPlaying} />
        </ControlButton>
        <ControlButton
          onClick={nextTrack}
          className={SMALL_BUTTON_CLASS}
          label="Next track"
        >
          <NextIcon />
        </ControlButton>
      </div>

      <VolumeControl volume={volume} setVolume={setVolume} />
    </div>
  );
}
