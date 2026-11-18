# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user is the owner themselves — Respire (handle: RimunAce). The site is a personal space: a place to express themselves and document life. Friends and casual visitors are a secondary audience; the owner has expressed the wish that it be easy for a friend to navigate (README).

## Product Purpose

A personal homepage where Respire can be themselves online — sharing what they love (anime, music, development, photos, life updates) without the constraints of a professional template. Success means authentic self-expression: the site feels like the person, not like a generic portfolio or social profile.

## Positioning

A living personal "world" rather than a static portfolio: the page is wired to the owner's real services — a persistent music player, their live AniList anime/manga data, live Malaysian news headlines, and an ongoing diary of updates — all under a distinct persona (Respire / Kasane Teto). What a neighboring product could not truthfully copy is that authenticity: one person's real tastes and voice, with real-time data as the proof.

## Operating Context

- Live at `https://respire.my`; the previous version remains at `https://other.respire.my`.
- Built with Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, NextUI; `bun` for development (`bun install`, `bun run dev`, port 3000).
- Updates, projects, gallery, and music playlists load from Appwrite TablesDB (`homepage` database). Photos and playlist files are in the `gallery` Storage bucket. If Appwrite is unreachable, those sections show an empty or error state. There is no static JSON snapshot.
- The owner updates content by editing rows in the Appwrite Console — keeping that burden low is part of how the site is maintained.
- AniList username is `Reuzin`; data fetched from the AniList GraphQL endpoint with local caching (5 min).
- Malaysian news headlines are aggregated server-side from trusted RSS feeds (Bernama, The Star, Malay Mail, NST, FMT). If that request fails, the ticker shows the last headlines saved in the browser, or says they are unavailable.

## Capabilities and Constraints

Confirmed functionality:

- **Home** — About Me (bio), Projects list, Contact, and Updates (mini-blog / diary) in a two-column layout.
- **Gallery** — image grid with lightbox modal and preloading progress.
- **AniList** — profile, stats (anime/manga), favorites, recent activities, and searchable/filterable/sortable anime & manga lists with graceful degradation to cached or partial data.
- **Music player** — persistent across pages; playlist switching, progress bar, volume, track playlist, a visualizer, and a "Miku mode" easter egg (Teto/Miku playlist toggle).
- **News ticker**: scrolling Malaysian news headlines with an "MY NEWS" label. If the feeds fail, it shows the last headlines saved in the browser, or says they are unavailable.
- **Loading screen**, scroll banner, and a canvas background (grid + cursor glow) on the home shell.

Constraints:

- Remote images are restricted to the allowlisted hosts in `next.config.js` (Appwrite storage, AniList CDNs, and the other hosts this page loads).
- Config via env vars: `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `NEXT_PUBLIC_APPWRITE_DATABASE_ID`, `NEXT_PUBLIC_APPWRITE_BUCKET_ID`, `NEXT_PUBLIC_ANILIST_USERNAME`, `NEXT_PUBLIC_ANILIST_ENDPOINT`.
- Content is real and owned by the user; updates read as personal diary entries (undecided: how far the site should scale beyond a personal space).

## Brand Commitments

Confirmed as binding by the owner:

- The name **Respire** (`RESPIRE`, `respire.my`).
- The **Kasane Teto** redhead character as mascot/avatar, and the "KASANE" identity in the header.
- Handles and contacts: GitHub `@RimunAce`, Discord `respire`, email `hi@respire.my`.
- Persona tagline in metadata: "Live, Love, Accept. Enjoyer of many, hater of none(?)."
- Self-described as "Developer and Forester."
- The old site (`other.respire.my`) remains referenced as part of the history.

## Evidence on Hand

- Diary updates, the project list, gallery photos, and playlists are rows in Appwrite TablesDB.
- Gallery images, playlist audio, and the Teto portrait are files in the Appwrite `gallery` bucket.
- Live external sources: AniList (user `Reuzin`) and Malaysian news RSS feeds.
- No testimonials, case studies, press, or third-party claims exist; future work must not fabricate them.

## Product Principles

1. **Authenticity first.** The site exists so Respire can be themselves — real data, real voice, real tastes; never a polished mask.
2. **Live over static.** Music, AniList, news, and updates should reflect reality. News and AniList may show the last cached copy when a request fails. Projects, updates, gallery, and playlists do not keep a snapshot: if Appwrite is down, those sections say so.
3. **Personality is a feature.** Easter eggs, the Teto persona, humor, and playfulness are part of the product, not defects.
4. **Low-maintenance for one person.** Content must stay easy to update (rows in the Appwrite Console); complexity should not grow faster than the desire to maintain it.
5. **Easy for friends.** The site should be navigable and welcoming for a casual visitor (the owner's stated hope), not just the owner.
