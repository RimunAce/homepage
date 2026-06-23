"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type ChangeEventHandler, type ReactNode } from "react";
import { useMusicPlayer } from "../../contexts/MusicPlayerContext";

const CONTROL_SHADOW = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
const BASE_BUTTON_CLASS = `border-2 border-retro-black bg-retro-white hover:bg-retro-black hover:text-retro-white transition-colors ${CONTROL_SHADOW}`;
const SMALL_BUTTON_CLASS = `p-4 ${BASE_BUTTON_CLASS}`;
const LARGE_BUTTON_CLASS = `p-6 ${BASE_BUTTON_CLASS}`;
const TRACK_TEXT_CLASS = "truncate max-w-xs md:max-w-md mx-auto";

interface ControlButtonProps {
  onClick: () => void;
  className: string;
  children: ReactNode;
}

const ControlButton = ({ onClick, className, children }: ControlButtonProps) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const AlbumArt = ({ thumbnail }: { thumbnail: string }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative w-64 h-64 md:w-80 md:h-80 mb-8 border-4 border-retro-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-retro-gray"
  >
    {thumbnail ? (
      <Image
        src={thumbnail}
        alt="Album Art"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 16rem, 20rem"
        priority
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-6xl">
        🎵
      </div>
    )}
  </motion.div>
);

const TrackInfo = ({ title, author }: { title: string; author: string }) => (
  <div className="text-center mb-8 space-y-2">
    <h2 className={`text-2xl md:text-3xl font-bold ${TRACK_TEXT_CLASS}`}>{title}</h2>
    <p className={`text-lg text-gray-600 ${TRACK_TEXT_CLASS}`}>{author}</p>
  </div>
);

interface RangeTrackProps {
  value: number;
  max: number;
  min: number;
  step?: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className: string;
}

const RangeTrack = ({ value, max, min, step = 1, onChange, className }: RangeTrackProps) => (
  <div className={className}>
    <div
      className="h-full bg-retro-black transition-all duration-100"
      style={{ width: `${(value / (max || 1)) * 100}%` }}
    />
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>
);

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
      className="relative h-4 bg-retro-gray border-2 border-retro-black"
    />
  </div>
);

interface IconProps {
  width: number;
  height: number;
  children: ReactNode;
}

const Icon = ({ width, height, children }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const PreviousIcon = () => (
  <Icon width={24} height={24}>
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line x1="5" y1="19" x2="5" y2="5"></line>
  </Icon>
);

const PauseIcon = () => (
  <Icon width={32} height={32}>
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </Icon>
);

const PlayIcon = () => (
  <Icon width={32} height={32}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </Icon>
);

const PlayPauseIcon = ({ isPlaying }: { isPlaying: boolean }) => (
  isPlaying ? <PauseIcon /> : <PlayIcon />
);

const NextIcon = () => (
  <Icon width={24} height={24}>
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </Icon>
);

const VolumeIcon = () => (
  <Icon width={20} height={20}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </Icon>
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
      <AlbumArt thumbnail={currentThumbnail} />
      <TrackInfo title={getCurrentTitle()} author={getCurrentAuthor()} />
      <ProgressBar currentTime={currentTime} duration={duration} formatTime={formatTime} onSeek={handleSeek} />

      <div className="flex items-center justify-center space-x-8 mb-8">
        <ControlButton onClick={prevTrack} className={SMALL_BUTTON_CLASS}>
          <PreviousIcon />
        </ControlButton>
        <ControlButton onClick={togglePlayPause} className={LARGE_BUTTON_CLASS}>
          <PlayPauseIcon isPlaying={isPlaying} />
        </ControlButton>
        <ControlButton onClick={nextTrack} className={SMALL_BUTTON_CLASS}>
          <NextIcon />
        </ControlButton>
      </div>

      <VolumeControl volume={volume} setVolume={setVolume} />
    </div>
  );
}
