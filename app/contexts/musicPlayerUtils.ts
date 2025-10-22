// Pure utility functions for the music player
// this is meant to be easter egg for science, lol

export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getMinecraftAudio(): string {
  return "https://cdn.apis.rocks/music-storage/Minecraft%E3%81%AE%E5%8A%B9%E6%9E%9C%E9%9F%B3%E3%81%A7%E3%82%B5%E3%82%A4%E3%82%A8%E3%83%B3%E3%82%B9.mp3";
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

export function getMinecraftThumbnail(): string {
  return "https://cdn.apis.rocks/music-storage/Minecraft%E3%81%AE%E5%8A%B9%E6%9F%9C%E9%9F%B3%E3%81%A7%E3%82%B5%E3%82%A4%E3%82%A8%E3%83%B3%E3%82%B9.png";
}
