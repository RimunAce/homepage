import { MediaItem } from "../types";
import { getProgressPercent, getProgressLabel } from "../utils/progressUtils";

interface MediaProgressOverlayProps {
  item: MediaItem;
}

export function MediaProgressOverlay({ item }: MediaProgressOverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-retro-black bg-opacity-90 p-1">
      <div className="h-2 bg-retro-gray border border-retro-white">
        <div className="h-full bg-green-500" style={{ width: `${getProgressPercent(item)}%` }} />
      </div>
      <p className="text-white text-xs text-center mt-1">{getProgressLabel(item)}</p>
    </div>
  );
}
