import { useCallback } from "react";

interface UsePlaybackControlsParams {
  tracks: { length: number };
  currentTrack: number;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentTrack: (track: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
}

export function usePlaybackControls({
  tracks,
  currentTrack,
  isPlaying,
  audioRef,
  setCurrentTrack,
  setIsPlaying,
  setCurrentTime,
}: UsePlaybackControlsParams) {
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audioRef, setIsPlaying]);

  const nextTrack = useCallback(() => {
    if (currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [
    currentTrack,
    tracks.length,
    setCurrentTrack,
    setIsPlaying,
    setCurrentTime,
  ]);

  const prevTrack = useCallback(() => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTrack, setCurrentTrack, setIsPlaying, setCurrentTime]);

  return {
    togglePlayPause,
    nextTrack,
    prevTrack,
  };
}
