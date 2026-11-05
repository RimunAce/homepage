import { motion } from "framer-motion";

interface ProgressBarProps {
  readonly currentTime: number;
  readonly duration: number;
  readonly formatTime: (time: number) => string;
  readonly onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProgressBar({
  currentTime,
  duration,
  formatTime,
  onSeek,
}: ProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xs font-mono whitespace-nowrap" aria-live="off">
          {formatTime(currentTime)}
        </span>
        <div className="relative min-h-11 flex-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-retro-black">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 overflow-hidden border-2 border-retro-black bg-retro-gray">
            <div
              className="h-full bg-retro-black transition-all duration-100"
              style={{
                width: `${(currentTime / (duration || 1)) * 100}%`,
              }}
            />
            <div
              className="absolute top-0 bottom-0 w-1 bg-retro-yellow"
              style={{
                left: `${(currentTime / (duration || 1)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Seek to position"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
          />
        </div>
        <span className="text-xs font-mono whitespace-nowrap" aria-live="off">
          {formatTime(duration)}
        </span>
      </div>
    </motion.div>
  );
}
