import type { Metadata } from "next";

const description = "Photos Respire has put up. Open one for a larger view.";

export const metadata: Metadata = {
  title: "Gallery",
  description,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery · Respire",
    description,
    url: "/gallery",
  },
  twitter: {
    title: "Gallery · Respire",
    description,
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
