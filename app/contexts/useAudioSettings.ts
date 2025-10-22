import { useEffect } from "react";

interface UseAudioSettingsParams {
  volume: number;
  currentTrack: number;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  setIsMinecraftMode: (mode: boolean) => void;
}

export function useAudioSettings({
  volume,
  currentTrack,
  isPlaying,
  audioRef,
  setIsMinecraftMode,
}: UseAudioSettingsParams) {
  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audioRef]);

  // Auto-play when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.play();
    }
  }, [currentTrack, isPlaying, audioRef]);

  // Reset easter egg when changing tracks
  useEffect(() => {
    setIsMinecraftMode(false);
  }, [currentTrack, setIsMinecraftMode]);
}
