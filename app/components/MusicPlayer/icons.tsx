import type { ReactNode } from "react";

interface IconProps {
  width: number;
  height: number;
  children: ReactNode;
}

export function Icon({ width, height, children }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PreviousIcon() {
  return (
    <Icon width={24} height={24}>
      <polygon points="19 20 9 12 19 4 19 20"></polygon>
      <line x1="5" y1="19" x2="5" y2="5"></line>
    </Icon>
  );
}

export function PauseIcon() {
  return (
    <Icon width={32} height={32}>
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </Icon>
  );
}

export function PlayIcon() {
  return (
    <Icon width={32} height={32}>
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </Icon>
  );
}

export function PlayPauseIcon({ isPlaying }: { isPlaying: boolean }) {
  return isPlaying ? <PauseIcon /> : <PlayIcon />;
}

export function NextIcon() {
  return (
    <Icon width={24} height={24}>
      <polygon points="5 4 15 12 5 20 5 4"></polygon>
      <line x1="19" y1="5" x2="19" y2="19"></line>
    </Icon>
  );
}

export function VolumeIcon() {
  return (
    <Icon width={20} height={20}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </Icon>
  );
}
