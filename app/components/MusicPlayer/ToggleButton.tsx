import SafeImage from "../SafeImage";
import { PlayIcon, PauseIcon } from "./icons";

interface ToggleButtonProps {
  readonly isOpen: boolean;
  readonly isPlaying: boolean;
  readonly isLoading: boolean;
  readonly unavailable: boolean;
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
  unavailable,
  title,
  author,
  thumbnail,
  onToggleDrawer,
  onTogglePlay,
}: ToggleButtonProps) {
  const label = isLoading
    ? "Loading playlist"
    : unavailable && !title
      ? "Playlist unavailable"
      : title
        ? `${isPlaying ? "Playing" : "Paused"}: ${title}`
        : "Music player";

  return (
    <div data-swarm-step className="fixed bottom-4 inset-x-4 z-50 flex rounded-2xl border border-[#626979] bg-[#151923]/95 text-white shadow-[0_16px_48px_rgba(0,0,0,.36)] md:inset-x-auto md:right-4 md:w-80">
      <button
        type="button"
        onClick={onToggleDrawer}
        className="flex min-h-16 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-l-2xl p-2 text-left transition-colors hover:bg-white/[0.08] active:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={isOpen ? `Close music player. ${label}` : `Open music player. ${label}`}
        id="music-player-toggle"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "music-player-panel" : undefined}
      >
        <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-white/15 bg-[#090b10]">
          {thumbnail ? (
            <SafeImage
              src={thumbnail}
              alt=""
              width={40}
              height={40}
              sizes="40px"
              loading="eager"
              className="w-full h-full object-cover"
              fallbackLabel=""
            />
          ) : null}
        </div>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold truncate">
            {isLoading
              ? "Loading playlist."
              : unavailable && !title
                ? "Playlist unavailable"
                : title || "Music"}
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
        className="min-h-16 w-12 flex-shrink-0 cursor-pointer rounded-r-2xl border-l border-l-[#626979] transition-colors hover:bg-white/[0.1] active:bg-white/[0.16] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <span className="flex items-center justify-center scale-75">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </span>
      </button>
    </div>
  );
}
