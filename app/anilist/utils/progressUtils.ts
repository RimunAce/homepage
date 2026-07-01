import { MediaItem } from "../types";

export function getProgressTotal(item: MediaItem) {
  return item.episodes || item.chapters || 100;
}

export function getProgressPercent(item: MediaItem) {
  const total = getProgressTotal(item);
  return Math.min(100, Math.max(0, ((item.mediaListEntry?.progress || 0) / total) * 100));
}

export function getProgressLabel(item: MediaItem) {
  return `${item.mediaListEntry?.progress || 0} / ${getProgressTotal(item)}`;
}
