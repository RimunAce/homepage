import type { Track } from "./useMusicPlayerState";
import { usePlaybackControls } from "./usePlaybackControls";
import { useTrackGetters } from "./useTrackGetters";
import { usePlayerHandlers } from "./usePlayerHandlers";

interface UseActionsParams {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  currentTime: number;
  isMinecraftMode: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentTrack: (track: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setIsMinecraftMode: (mode: boolean) => void;
}

export function useMusicPlayerActions(params: UseActionsParams) {
  const playbackControls = usePlaybackControls({
    tracks: params.tracks,
    currentTrack: params.currentTrack,
    isPlaying: params.isPlaying,
    audioRef: params.audioRef,
    setCurrentTrack: params.setCurrentTrack,
    setIsPlaying: params.setIsPlaying,
    setCurrentTime: params.setCurrentTime,
  });

  const trackGetters = useTrackGetters({
    tracks: params.tracks,
    currentTrack: params.currentTrack,
    isMinecraftMode: params.isMinecraftMode,
  });

  const handlers = usePlayerHandlers({
    tracks: params.tracks,
    currentTrack: params.currentTrack,
    isPlaying: params.isPlaying,
    currentTime: params.currentTime,
    isMinecraftMode: params.isMinecraftMode,
    audioRef: params.audioRef,
    setCurrentTime: params.setCurrentTime,
    setIsMinecraftMode: params.setIsMinecraftMode,
  });

  return {
    ...playbackControls,
    ...trackGetters,
    ...handlers,
  };
}
