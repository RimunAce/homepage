import type { Track } from "./useMusicPlayerState";
import { useTrackLoading } from "./useTrackLoading";
import { usePlaylistSwitching } from "./usePlaylistSwitching";
import { useAudioEventListeners } from "./useAudioEventListeners";
import { useAudioSettings } from "./useAudioSettings";

interface UseEffectsParams {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  volume: number;
  isMikuMode: boolean;
  tetoTracks: Track[];
  mikuTracks: Track[];
  audioRef: React.RefObject<HTMLAudioElement>;
  previousMikuModeRef: React.MutableRefObject<boolean>;
  setTracks: (tracks: Track[]) => void;
  setTetoTracks: (tracks: Track[]) => void;
  setMikuTracks: (tracks: Track[]) => void;
  setCurrentTrack: (track: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsMinecraftMode: (mode: boolean) => void;
}

export function useMusicPlayerEffects(params: UseEffectsParams) {
  // Load tracks from JSON files
  useTrackLoading({
    setTetoTracks: params.setTetoTracks,
    setMikuTracks: params.setMikuTracks,
    setTracks: params.setTracks,
    setIsLoading: params.setIsLoading,
  });

  // Handle playlist switching when Miku mode toggles
  usePlaylistSwitching({
    isMikuMode: params.isMikuMode,
    tetoTracks: params.tetoTracks,
    mikuTracks: params.mikuTracks,
    audioRef: params.audioRef,
    previousMikuModeRef: params.previousMikuModeRef,
    setTracks: params.setTracks,
    setCurrentTrack: params.setCurrentTrack,
    setCurrentTime: params.setCurrentTime,
    setIsPlaying: params.setIsPlaying,
  });

  // Set up audio element event listeners
  useAudioEventListeners({
    audioRef: params.audioRef,
    currentTrack: params.currentTrack,
    tracksLength: params.tracks.length,
    setCurrentTrack: params.setCurrentTrack,
    setCurrentTime: params.setCurrentTime,
    setDuration: params.setDuration,
  });

  // Handle volume, auto-play, and easter egg reset
  useAudioSettings({
    volume: params.volume,
    currentTrack: params.currentTrack,
    isPlaying: params.isPlaying,
    audioRef: params.audioRef,
    setIsMinecraftMode: params.setIsMinecraftMode,
  });
}
