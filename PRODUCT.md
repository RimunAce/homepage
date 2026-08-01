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
- Content is remote-driven: updates, projects, gallery, and music playlists load from a GitHub Gist (owner's repo) via `DATA_URLS`; the `public/data/*.json` files are remnants, not the source of truth.
- The owner updates content by editing JSON (updates/projects/gallery/playlists) — keeping that burden low is part of how the site is maintained.
- AniList username is `Reuzin`; data fetched from the AniList GraphQL endpoint with local caching (5 min).
- Malaysian news headlines are aggregated server-side from trusted RSS feeds (Bernama, The Star, Malay Mail, NST, FMT) with a fallback set in the client.

## Capabilities and Constraints

Confirmed functionality:

- **Home** — About Me (bio), Projects list, Contact, and Updates (mini-blog / diary) in a two-column layout.
- **Gallery** — image grid with lightbox modal and preloading progress.
- **AniList** — profile, stats (anime/manga), favorites, recent activities, and searchable/filterable/sortable anime & manga lists with graceful degradation to cached or partial data.
- **Music player** — persistent across pages; playlist switching, progress bar, volume, track playlist, a visualizer, and a "Miku mode" easter egg (Teto/Miku playlist toggle).
- **News ticker** — scrolling Malaysian news headlines with an "MY NEWS" label and client-side fallback items.
- **Loading screen**, scroll banner, and a canvas background (grid + cursor glow) on the home shell.

Constraints:

- Remote images are restricted to the allowlisted hosts in `next.config.js` (`cdn.apis.rocks`, AniList CDNs, etc.).
- Config via env vars: `NEXT_PUBLIC_ANILIST_USERNAME`, `NEXT_PUBLIC_ANILIST_ENDPOINT`, `NEXT_PUBLIC_GIST_ID`, `NEXT_PUBLIC_GIST_USERNAME`.
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

- Real diary updates in `public/data/updates.json` (also remote).
- Real project list in `public/data/projects.json` (also remote) — with names, links, dates, and statuses.
- Real avatar/mascot imagery served from `cdn.apis.rocks` (used as favicon, bio avatar, contact character).
- Live external sources: AniList (user `Reuzin`), Malaysian news RSS feeds, GitHub Gist data.
- No testimonials, case studies, press, or third-party claims exist; future work must not fabricate them.

## Product Principles

1. **Authenticity first.** The site exists so Respire can be themselves — real data, real voice, real tastes; never a polished mask.
2. **Live over static.** Music, AniList, news, and updates should reflect reality; fallbacks are a safety net, not a substitute.
3. **Personality is a feature.** Easter eggs, the Teto persona, humor, and playfulness are part of the product, not defects.
4. **Low-maintenance for one person.** Content must stay easy to update (simple JSON/remote data); complexity should not grow faster than the desire to maintain it.
5. **Easy for friends.** The site should be navigable and welcoming for a casual visitor (the owner's stated hope), not just the owner.
