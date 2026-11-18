import { useEffect } from "react";
import type { Track } from "./useMusicPlayerState";
import { fetchPlaylist } from "@/app/lib/content";

interface UseTrackLoadingParams {
  setTetoTracks: (tracks: Track[]) => void;
  setMikuTracks: (tracks: Track[]) => void;
  setTracks: (tracks: Track[]) => void;
  setIsLoading: (loading: boolean) => void;
  setTetoFailed: (failed: boolean) => void;
  setMikuFailed: (failed: boolean) => void;
}

export function useTrackLoading({
  setTetoTracks,
  setMikuTracks,
  setTracks,
  setIsLoading,
  setTetoFailed,
  setMikuFailed,
}: UseTrackLoadingParams) {
  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([fetchPlaylist("teto"), fetchPlaylist("miku")]).then(
      ([tetoResult, mikuResult]) => {
        if (cancelled) return;
        const teto = tetoResult.status === "fulfilled" ? tetoResult.value : [];
        const miku = mikuResult.status === "fulfilled" ? mikuResult.value : [];
        setTetoFailed(tetoResult.status === "rejected");
        setMikuFailed(mikuResult.status === "rejected");
        setTetoTracks(teto);
        setMikuTracks(miku);
        setTracks(teto);
        setIsLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [
    setTetoTracks,
    setMikuTracks,
    setTracks,
    setIsLoading,
    setTetoFailed,
    setMikuFailed,
  ]);
}
