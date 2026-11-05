import type { Metadata } from "next";

const description = "Anime and manga from Respire's AniList, under the name Reuzin.";

export const metadata: Metadata = {
  title: "AniList",
  description,
  alternates: { canonical: "/anilist" },
  openGraph: {
    title: "AniList · Respire",
    description,
    url: "/anilist",
  },
  twitter: {
    title: "AniList · Respire",
    description,
  },
};

export default function AniListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
