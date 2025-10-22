import { useEffect } from "react";
import type { Track } from "./useMusicPlayerState";

interface UsePlaylistSwitchingParams {
  isMikuMode: boolean;
  tetoTracks: Track[];
  mikuTracks: Track[];
  audioRef: React.RefObject<HTMLAudioElement>;
  previousMikuModeRef: React.MutableRefObject<boolean>;
  setTracks: (tracks: Track[]) => void;
  setCurrentTrack: (track: number) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export function usePlaylistSwitching({
  isMikuMode,
  tetoTracks,
  mikuTracks,
  audioRef,
  previousMikuModeRef,
  setTracks,
  setCurrentTrack,
  setCurrentTime,
  setIsPlaying,
}: UsePlaylistSwitchingParams) {
  useEffect(() => {
    if (previousMikuModeRef.current === isMikuMode) {
      previousMikuModeRef.current = isMikuMode;
      return;
    }

    if (tetoTracks.length === 0 || mikuTracks.length === 0) return;

    previousMikuModeRef.current = isMikuMode;

    const audio = audioRef.current;
    const wasPlaying = !audio?.paused;

    if (audio && wasPlaying) {
      audio.pause();
    }

    setTracks(isMikuMode ? mikuTracks : tetoTracks);
    setCurrentTrack(0);
    setCurrentTime(0);
    setIsPlaying(false);

    if (wasPlaying) {
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    }
  }, [
    isMikuMode,
    mikuTracks,
    tetoTracks,
    audioRef,
    previousMikuModeRef,
    setTracks,
    setCurrentTrack,
    setCurrentTime,
    setIsPlaying,
  ]);
}
