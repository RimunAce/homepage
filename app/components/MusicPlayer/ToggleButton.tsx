import Image from "next/image";
import { PlayIcon, PauseIcon } from "./icons";

interface ToggleButtonProps {
  readonly isOpen: boolean;
  readonly isPlaying: boolean;
  readonly isLoading: boolean;
  readonly title: string;
  readonly author: string;
  readonly thumbnail: string;
  readonly onToggleDrawer: () => void;
  readonly onTogglePlay: () => void;
}

export default function ToggleButton({
  isOpen,
  isPlaying,
  isLoading,
  title,
  author,
  thumbnail,
  onToggleDrawer,
  onTogglePlay,
}: ToggleButtonProps) {
  const label = isLoading
    ? "Loading playlist"
    : title
      ? `${isPlaying ? "Playing" : "Paused"}: ${title}`
      : "Music player";

  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-4 md:w-80 z-50 flex border-2 border-retro-black bg-retro-white text-retro-black"
      style={{ boxShadow: "4px 4px 0px #000000" }}
    >
      <button
        type="button"
        onClick={onToggleDrawer}
        className="flex-1 min-w-0 flex items-center gap-2 p-2 text-left hover:bg-retro-gray transition-colors"
        aria-label={isOpen ? `Close music player. ${label}` : `Open music player. ${label}`}
        id="music-player-toggle"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "music-player-panel" : undefined}
      >
        <div className="w-10 h-10 border-2 border-retro-black flex-shrink-0 overflow-hidden bg-retro-gray">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt=""
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold truncate">
            {isLoading ? "Loading playlist…" : title || "Music"}
          </span>
          <span className="block text-[11px] truncate opacity-70">
            {author || (isOpen ? "Close player" : "Open player")}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={onTogglePlay}
        disabled={isLoading || !title}
        className="flex-shrink-0 w-12 border-l-2 border-retro-black hover:bg-retro-black hover:text-retro-white transition-colors disabled:opacity-40"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <span className="flex items-center justify-center scale-75">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </span>
      </button>
    </div>
  );
}
