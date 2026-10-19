import { useEffect } from "react";
import type { Track } from "./useMusicPlayerState";
import { fetchPlaylist } from "@/app/lib/content";

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
    Promise.all([fetchPlaylist("teto"), fetchPlaylist("miku")]).then(
      ([tetoData, mikuData]) => {
        setTetoTracks(tetoData);
        setMikuTracks(mikuData);
        setTracks(tetoData);
        setIsLoading(false);
      }
    );
  }, [setTetoTracks, setMikuTracks, setTracks, setIsLoading]);
}
