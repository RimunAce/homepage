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
        <span className="text-xs font-mono whitespace-nowrap">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 relative">
          <div className="h-3 bg-retro-gray border-2 border-retro-black relative overflow-hidden">
            <div
              className="h-full bg-retro-black transition-all duration-100"
              style={{
                width: `${(currentTime / (duration || 1)) * 100}%`,
              }}
            />
            <div
              className="absolute top-0 bottom-0 w-1 bg-red-600"
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
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-xs font-mono whitespace-nowrap">
          {formatTime(duration)}
        </span>
      </div>
    </motion.div>
  );
}
