"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useMusicPlayerState, type Track } from "./useMusicPlayerState";
import { useMusicPlayerActions } from "./useMusicPlayerActions";
import { useMusicPlayerEffects } from "./useMusicPlayerEffects";
import { formatTime } from "./musicPlayerUtils";

interface MusicPlayerContextType {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  isOpen: boolean;
  volume: number;
  isMinecraftMode: boolean;
  isMikuMode: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentTrack: (track: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsOpen: (open: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMinecraftMode: (mode: boolean) => void;
  setIsMikuMode: (mode: boolean) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleThumbnailClick: () => void;
  formatTime: (time: number) => string;
  getCurrentAudio: () => string;
  getCurrentTitle: () => string;
  getCurrentAuthor: () => string;
  getCurrentAuthorUrl: () => string;
  getCurrentThumbnail: () => string;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export function MusicPlayerProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  // Initialize all state
  const state = useMusicPlayerState();

  // Initialize all actions
  const actions = useMusicPlayerActions({
    tracks: state.tracks,
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    isMinecraftMode: state.isMinecraftMode,
    audioRef: state.audioRef,
    setCurrentTrack: state.setCurrentTrack,
    setIsPlaying: state.setIsPlaying,
    setCurrentTime: state.setCurrentTime,
    setIsMinecraftMode: state.setIsMinecraftMode,
  });

  // Set up all effects
  useMusicPlayerEffects({
    tracks: state.tracks,
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
    volume: state.volume,
    isMikuMode: state.isMikuMode,
    tetoTracks: state.tetoTracks,
    mikuTracks: state.mikuTracks,
    audioRef: state.audioRef,
    previousMikuModeRef: state.previousMikuModeRef,
    setTracks: state.setTracks,
    setTetoTracks: state.setTetoTracks,
    setMikuTracks: state.setMikuTracks,
    setCurrentTrack: state.setCurrentTrack,
    setIsPlaying: state.setIsPlaying,
    setCurrentTime: state.setCurrentTime,
    setDuration: state.setDuration,
    setIsLoading: state.setIsLoading,
    setIsMinecraftMode: state.setIsMinecraftMode,
  });

  const value = useMemo(
    () => ({
      tracks: state.tracks,
      currentTrack: state.currentTrack,
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      duration: state.duration,
      isLoading: state.isLoading,
      isOpen: state.isOpen,
      volume: state.volume,
      isMinecraftMode: state.isMinecraftMode,
      isMikuMode: state.isMikuMode,
      audioRef: state.audioRef,
      setCurrentTrack: state.setCurrentTrack,
      setIsPlaying: state.setIsPlaying,
      setCurrentTime: state.setCurrentTime,
      setDuration: state.setDuration,
      setIsOpen: state.setIsOpen,
      setVolume: state.setVolume,
      setIsMinecraftMode: state.setIsMinecraftMode,
      setIsMikuMode: state.setIsMikuMode,
      togglePlayPause: actions.togglePlayPause,
      nextTrack: actions.nextTrack,
      prevTrack: actions.prevTrack,
      handleSeek: actions.handleSeek,
      handleThumbnailClick: actions.handleThumbnailClick,
      formatTime,
      getCurrentAudio: actions.getCurrentAudio,
      getCurrentTitle: actions.getCurrentTitle,
      getCurrentAuthor: actions.getCurrentAuthor,
      getCurrentAuthorUrl: actions.getCurrentAuthorUrl,
      getCurrentThumbnail: actions.getCurrentThumbnail,
    }),
    [
      state.tracks,
      state.currentTrack,
      state.isPlaying,
      state.isLoading,
      state.isOpen,
      state.volume,
      state.isMinecraftMode,
      state.isMikuMode,
      actions.togglePlayPause,
      actions.nextTrack,
      actions.prevTrack,
      actions.handleSeek,
      actions.handleThumbnailClick,
      actions.getCurrentAudio,
      actions.getCurrentTitle,
      actions.getCurrentAuthor,
      actions.getCurrentAuthorUrl,
      actions.getCurrentThumbnail,
    ]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
