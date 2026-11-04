// One-off migration: uploads gallery images and music assets from cdn.apis.rocks
// into the Appwrite `gallery` bucket, then rewrites the JSON data files to point
// at Appwrite file URLs. Safe to re-run: existing file IDs are skipped.
import fs from "node:fs";
import path from "node:path";

const ENDPOINT = "https://syd.cloud.appwrite.io/v1";
const PROJECT = "68f8d96a0021b0ae0895";
const BUCKET = "gallery";
const KEY = process.env.APPWRITE_EPHEMERAL_KEY;

if (!KEY) {
  console.error("APPWRITE_EPHEMERAL_KEY is required");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const dataDir = path.join(root, "public", "data");

const headers = {
  "X-Appwrite-Project": PROJECT,
  "X-Appwrite-Key": KEY,
};

function fileUrl(fileId) {
  return `${ENDPOINT}/storage/buckets/${BUCKET}/files/${fileId}/view?project=${PROJECT}`;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
}

async function fileExists(fileId) {
  const res = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET}/files/${fileId}`, {
    headers,
  });
  return res.ok;
}

async function upload(fileId, url, folder) {
  if (await fileExists(fileId)) {
    console.log(`skip   ${fileId}`);
    return fileUrl(fileId);
  }

  const source = await fetch(url);
  if (!source.ok) {
    throw new Error(`download failed ${url}: ${source.status}`);
  }
  const bytes = await source.arrayBuffer();
  const filename = decodeURIComponent(path.basename(new URL(url).pathname));

  const body = new FormData();
  body.set("fileId", fileId);
  body.set("file", new Blob([bytes]), filename);
  body.set("folder", folder);

  const res = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET}/files`, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`upload failed ${fileId}: ${res.status} ${text}`);
  }

  console.log(`upload ${fileId}`);
  return fileUrl(fileId);
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

function writeJson(name, value) {
  fs.writeFileSync(
    path.join(dataDir, name),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

async function migrateGallery() {
  const images = readJson("gallery.json");
  const out = [];

  for (const [index, image] of images.entries()) {
    const id = `gallery-${index + 1}-${slug(image.caption || "image")}`.slice(0, 36);
    const url = await upload(id, image.url, "gallery");
    out.push({ ...image, url, fileId: id });
  }

  writeJson("gallery.json", out);
  console.log(`gallery: ${out.length} images`);
}

async function migratePlaylist(file, playlist) {
  const tracks = readJson(file);
  const out = [];

  for (const [index, track] of tracks.entries()) {
    const base = `${playlist}-${index + 1}-${slug(track.id)}`.slice(0, 30);
    const thumbId = `${base}-art`;
    const audioId = `${base}-audio`;

    const thumbnail = await upload(thumbId, track.thumbnail, `${playlist}/art`);
    const audio = await upload(audioId, track.audio, `${playlist}/audio`);

    out.push({
      ...track,
      thumbnail,
      audio,
      thumbnailFileId: thumbId,
      audioFileId: audioId,
    });
  }

  writeJson(file, out);
  console.log(`${file}: ${out.length} tracks`);
}

await migrateGallery();
await migratePlaylist("music.json", "teto");
await migratePlaylist("music-miku.json", "miku");
