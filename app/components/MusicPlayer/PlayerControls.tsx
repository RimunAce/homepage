import { motion } from "framer-motion";
import { PreviousIcon, PlayPauseIcon, NextIcon, VolumeIcon } from "./icons";

interface PlayerControlsProps {
  readonly isPlaying: boolean;
  readonly volume: number;
  readonly onPrev: () => void;
  readonly onTogglePlay: () => void;
  readonly onNext: () => void;
  readonly onVolumeChange: (volume: number) => void;
}

export default function PlayerControls({
  isPlaying,
  volume,
  onPrev,
  onTogglePlay,
  onNext,
  onVolumeChange,
}: PlayerControlsProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mb-6"
    >
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          type="button"
          onClick={onPrev}
          className="retro-button p-4"
          aria-label="Previous track"
        >
          <PreviousIcon />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          className="retro-button p-6"
          aria-label={isPlaying ? "Pause" : "Play"}
          aria-pressed={isPlaying}
        >
          <PlayPauseIcon isPlaying={isPlaying} />
        </button>

        <button
          type="button"
          onClick={onNext}
          className="retro-button p-4"
          aria-label="Next track"
        >
          <NextIcon />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center space-x-3 max-w-xs mx-auto">
        <VolumeIcon />
        <div className="relative min-h-11 flex-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-retro-black">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden border-2 border-retro-black bg-retro-gray">
            <div
              className="h-full bg-retro-black transition-all duration-100"
              style={{ width: `${volume * 100}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-1 bg-retro-yellow"
              style={{
                left: `${volume * 100}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(Number.parseFloat(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Volume"
          />
        </div>
        <span className="text-xs font-mono">{Math.round(volume * 100)}%</span>
      </div>
    </motion.div>
  );
}
