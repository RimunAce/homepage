import { useState, useRef } from "react";

export interface Track {
  id: string;
  title: string;
  thumbnail: string;
  audio: string;
  author: string;
  authorUrl: string;
}

export function useMusicPlayerState() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [tetoTracks, setTetoTracks] = useState<Track[]>([]);
  const [mikuTracks, setMikuTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMinecraftMode, setIsMinecraftMode] = useState(false);
  const [isMikuMode, setIsMikuMode] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const previousMikuModeRef = useRef(isMikuMode);

  return {
    tracks,
    setTracks,
    tetoTracks,
    setTetoTracks,
    mikuTracks,
    setMikuTracks,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    isLoading,
    setIsLoading,
    isOpen,
    setIsOpen,
    volume,
    setVolume,
    isMinecraftMode,
    setIsMinecraftMode,
    isMikuMode,
    setIsMikuMode,
    audioRef,
    previousMikuModeRef,
  };
}
