import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import MusicPlayer from "./components/MusicPlayer";
import Background from "./components/Background";
import Header from "./components/Header";
import NewsTicker from "./components/NewsTicker";
import { ErrorBoundary } from "./components/ErrorBoundary";

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
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:bg-retro-white focus:text-retro-black focus:border-2 focus:border-retro-black focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <LoadingScreen />
          <div className="min-h-screen bg-retro-gray relative">
            <Background />
            <Header />
            <ErrorBoundary>
              <NewsTicker />
            </ErrorBoundary>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            <MusicPlayer />
          </ErrorBoundary>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
