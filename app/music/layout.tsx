import type { Metadata } from "next";

const description = "The player that stays on. Teto's playlist, and a Miku one if you find the switch.";

export const metadata: Metadata = {
  title: "Music",
  description,
  alternates: { canonical: "/music" },
  openGraph: {
    title: "Music · Respire",
    description,
    url: "/music",
  },
  twitter: {
    title: "Music · Respire",
    description,
  },
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
