import { useEffect } from "react";
import type { Track } from "./useMusicPlayerState";
import { DATA_URLS } from "@/app/lib/dataUrls";

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
      fetch(DATA_URLS.music).then((res) => res.json()),
      fetch(DATA_URLS.musicMiku).then((res) => res.json()),
    ]).then(([tetoData, mikuData]) => {
      setTetoTracks(tetoData);
      setMikuTracks(mikuData);
      setTracks(tetoData);
      setIsLoading(false);
    });
  }, [setTetoTracks, setMikuTracks, setTracks, setIsLoading]);
}
