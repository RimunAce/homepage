import { useCallback } from "react";
import type { Track } from "./useMusicPlayerState";
import {
  getMinecraftAudio,
  getMinecraftTitle,
  getMinecraftAuthor,
  getMinecraftAuthorUrl,
  getMinecraftThumbnail,
} from "./musicPlayerUtils";

interface UseTrackGettersParams {
  tracks: Track[];
  currentTrack: number;
  isMinecraftMode: boolean;
}

export function useTrackGetters({
  tracks,
  currentTrack,
  isMinecraftMode,
}: UseTrackGettersParams) {
  const getCurrentAudio = useCallback(() => {
    const currentTrackData = tracks[currentTrack];
    if (currentTrackData?.id === "science" && isMinecraftMode) {
      return getMinecraftAudio();
    }
    return currentTrackData?.audio;
  }, [tracks, currentTrack, isMinecraftMode]);

  const getCurrentTitle = useCallback(() => {
    const currentTrackData = tracks[currentTrack];
    if (currentTrackData?.id === "science" && isMinecraftMode) {
      return getMinecraftTitle();
    }
    return currentTrackData?.title;
  }, [tracks, currentTrack, isMinecraftMode]);

  const getCurrentAuthor = useCallback(() => {
    const currentTrackData = tracks[currentTrack];
    if (currentTrackData?.id === "science" && isMinecraftMode) {
      return getMinecraftAuthor();
    }
    return currentTrackData?.author;
  }, [tracks, currentTrack, isMinecraftMode]);

  const getCurrentAuthorUrl = useCallback(() => {
    const currentTrackData = tracks[currentTrack];
    if (currentTrackData?.id === "science" && isMinecraftMode) {
      return getMinecraftAuthorUrl();
    }
    return currentTrackData?.authorUrl;
  }, [tracks, currentTrack, isMinecraftMode]);

  const getCurrentThumbnail = useCallback(() => {
    const currentTrackData = tracks[currentTrack];
    if (currentTrackData?.id === "science" && isMinecraftMode) {
      return getMinecraftThumbnail();
    }
    return currentTrackData?.thumbnail;
  }, [tracks, currentTrack, isMinecraftMode]);

  return {
    getCurrentAudio,
    getCurrentTitle,
    getCurrentAuthor,
    getCurrentAuthorUrl,
    getCurrentThumbnail,
  };
}
