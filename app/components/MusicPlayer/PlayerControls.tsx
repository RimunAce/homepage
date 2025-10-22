import { motion } from "framer-motion";

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
        <button onClick={onPrev} className="retro-button text-lg px-4 py-3">
          ⏮
        </button>

        <button
          onClick={onTogglePlay}
          className="retro-button text-2xl px-6 py-3"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={onNext} className="retro-button text-lg px-4 py-3">
          ⏭
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center space-x-3 max-w-xs mx-auto">
        <span className="text-xs font-mono">🔈</span>
        <div className="flex-1 relative">
          <div className="h-2 bg-retro-gray border-2 border-retro-black relative overflow-hidden">
            <div
              className="h-full bg-retro-black transition-all duration-100"
              style={{ width: `${volume * 100}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-1 bg-red-600"
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
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-xs font-mono">{Math.round(volume * 100)}%</span>
      </div>
    </motion.div>
  );
}
