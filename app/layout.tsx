import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import MusicPlayer from "./components/MusicPlayer";

export const metadata: Metadata = {
  title: "Respire.My World",
  description: "Live, Love, Accept. Enjoyer of many, hater of none(?).",
  icons: {
    icon: "https://cdn.apis.rocks/teto.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-retro-gray">
        <MusicPlayerProvider>
          <LoadingScreen />
          {children}
          <MusicPlayer />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
