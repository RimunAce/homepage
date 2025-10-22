import { useCallback } from "react";
import type { Track } from "./useMusicPlayerState";

interface UsePlayerHandlersParams {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  currentTime: number;
  isMinecraftMode: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentTime: (time: number) => void;
  setIsMinecraftMode: (mode: boolean) => void;
}

export function usePlayerHandlers({
  tracks,
  currentTrack,
  isPlaying,
  currentTime,
  isMinecraftMode,
  audioRef,
  setCurrentTime,
  setIsMinecraftMode,
}: UsePlayerHandlersParams) {
  const handleThumbnailClick = useCallback(() => {
    const currentTrackData = tracks[currentTrack];
    if (currentTrackData?.id === "science") {
      const audio = audioRef.current;
      if (!audio) return;

      const wasPlaying = isPlaying;
      const currentPos = currentTime;

      setIsMinecraftMode(!isMinecraftMode);

      setTimeout(() => {
        audio.currentTime = currentPos;
        if (wasPlaying) {
          audio.play();
        }
      }, 50);
    }
  }, [
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    isMinecraftMode,
    audioRef,
    setIsMinecraftMode,
  ]);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;

      const newTime = Number.parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [audioRef, setCurrentTime]
  );

  return {
    handleThumbnailClick,
    handleSeek,
  };
}
