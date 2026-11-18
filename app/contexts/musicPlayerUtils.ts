export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Science-track cover swap. Both URLs stay null until a copy exists, so playback never requests the parked CDN.
export function getMinecraftAudio(): string | null {
  return null;
}

export function getMinecraftTitle(): string {
  return "Science but Minecraft (Minecraftの効果音でサイエンス)";
}

export function getMinecraftAuthor(): string {
  return "gmailアカウント";
}

export function getMinecraftAuthorUrl(): string {
  return "https://www.youtube.com/@gmail3885";
}

export function getMinecraftThumbnail(): string | null {
  return null;
}

export function isMinecraftEggAvailable(): boolean {
  return Boolean(getMinecraftAudio() && getMinecraftThumbnail());
}
