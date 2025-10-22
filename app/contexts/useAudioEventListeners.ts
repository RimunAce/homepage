import { useEffect } from "react";

interface UseAudioEventListenersParams {
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTrack: number;
  tracksLength: number;
  setCurrentTrack: (track: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
}

export function useAudioEventListeners({
  audioRef,
  currentTrack,
  tracksLength,
  setCurrentTrack,
  setCurrentTime,
  setDuration,
}: UseAudioEventListenersParams) {
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrack < tracksLength - 1) {
        setCurrentTrack(currentTrack + 1);
        setCurrentTime(0);
      } else {
        setCurrentTrack(0);
        setCurrentTime(0);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    audioRef,
    currentTrack,
    tracksLength,
    setCurrentTrack,
    setCurrentTime,
    setDuration,
  ]);
}
