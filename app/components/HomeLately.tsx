import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { fetchHomeNote, fetchHomePhoto, fetchHomeTrack } from "../lib/content";
import SafeImage from "./SafeImage";
import styles from "./home-lately.module.css";

async function DiaryNote() {
  const note = await fetchHomeNote().catch(() => null);
  return note?.content ? (
    <>
      {Boolean(note.date) && <p className={styles.meta}>{String(note.date)}</p>}
      <blockquote>{String(note.content)}</blockquote>
    </>
  ) : <p className={styles.quiet}>{note === null ? "Couldn’t load the diary note." : "No diary notes yet."}</p>;
}

async function GalleryPhoto() {
  const photo = await fetchHomePhoto().catch(() => null);
  const caption = typeof photo?.caption === "string" ? photo.caption : "";
  return typeof photo?.url === "string" && photo.url ? (
    <figure>
      <Link href="/gallery" className={styles.photo} aria-label="Browse the gallery">
        <SafeImage src={photo.url} alt={caption || "Photo from Respire’s gallery"} fill sizes="(min-width: 1152px) 620px, (min-width: 768px) 56vw, 100vw" />
      </Link>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  ) : <p className={styles.quiet}>{photo === null ? "Couldn’t load a gallery photo." : "No photos yet."}</p>;
}

async function PlaylistTrack() {
  const track = await fetchHomeTrack().catch(() => null);
  return track?.title ? (
    <div className={styles.track}>
      {track.thumbnail && (
        <div className={styles.cover}>
          <SafeImage src={track.thumbnail} alt="" fill sizes="64px" />
        </div>
      )}
      <div>
        <strong>{track.title}</strong>
        {track.author && <p className={styles.quiet}>{track.author}</p>}
      </div>
    </div>
  ) : <p className={styles.quiet}>{track === null ? "Couldn’t load the playlist pick." : "No tracks yet."}</p>;
}

function Loading({ children }: { children: string }) {
  return <p className={styles.quiet} role="status">{children}</p>;
}

export default async function HomeLately() {
  await connection();

  return (
    <section id="lately" className={styles.lately} aria-labelledby="lately-title" data-swarm-step>
      <header className={styles.heading}>
        <h2 id="lately-title">Lately<span>.</span></h2>
      </header>
      <div className={styles.spread}>
        <div className={styles.note}>
          <h3>From the diary</h3>
          <Suspense fallback={<Loading>Loading diary note.</Loading>}>
            <DiaryNote />
          </Suspense>
        </div>
        <div className={styles.gallery}>
          <h3><Link href="/gallery">From the gallery <span aria-hidden="true">↗</span></Link></h3>
          <Suspense fallback={<div className={styles.photo}><Loading>Loading gallery photo.</Loading></div>}>
            <GalleryPhoto />
          </Suspense>
        </div>
        <div className={styles.music}>
          <h3><Link href="/music">From the playlist <span aria-hidden="true">↗</span></Link></h3>
          <Suspense fallback={<Loading>Loading playlist pick.</Loading>}>
            <PlaylistTrack />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
