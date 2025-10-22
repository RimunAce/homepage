import { useEffect } from "react";
import type { Track } from "./useMusicPlayerState";

interface UseTrackLoadingParams {
  setTetoTracks: (tracks: Track[]) => void;
  setMikuTracks: (tracks: Track[]) => void;
  setTracks: (tracks: Track[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useTrackLoading({
  setTetoTracks,
  setMikuTracks,
  setTracks,
  setIsLoading,
}: UseTrackLoadingParams) {
  useEffect(() => {
    Promise.all([
      fetch("/data/music.json").then((res) => res.json()),
      fetch("/data/music-miku.json").then((res) => res.json()),
    ]).then(([tetoData, mikuData]) => {
      setTetoTracks(tetoData);
      setMikuTracks(mikuData);
      setTracks(tetoData);
      setIsLoading(false);
    });
  }, [setTetoTracks, setMikuTracks, setTracks, setIsLoading]);
}
