import type { Metadata, Viewport } from "next";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import MusicPlayer from "./components/MusicPlayer";
import Background from "./components/Background";
import Header from "./components/Header";
import NewsTicker from "./components/NewsTicker";
import { ErrorBoundary } from "./components/ErrorBoundary";
import MotionPreference from "./components/MotionPreference";
import SiteFooter from "./components/SiteFooter";

const description = "Live, Love, Accept. Enjoyer of many, hater of none(?).";
const siteUrl = "https://respire.my";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Respire.My World",
      description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Respire",
      alternateName: "RimunAce",
      url: siteUrl,
      email: "hi@respire.my",
      jobTitle: "Developer and Forester",
      sameAs: ["https://github.com/RimunAce", "https://anilist.co/user/Reuzin"],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Respire.My World",
    template: "%s · Respire",
  },
  description,
  applicationName: "Respire",
  authors: [{ name: "Respire", url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en",
    url: "/",
    siteName: "Respire",
    title: "Respire.My World",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Respire.My World",
    description,
  },
  icons: {
    icon: "https://cdn.apis.rocks/teto.jpg",
    apple: "https://cdn.apis.rocks/teto.jpg",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e0e0e0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-retro-gray">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MusicPlayerProvider>
          <MotionPreference>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:inline-flex focus:min-h-11 focus:items-center focus:bg-retro-white focus:text-retro-black focus:border-2 focus:border-retro-black focus:px-3 focus:py-2"
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
              <SiteFooter />
            </div>
            <ErrorBoundary>
              <MusicPlayer />
            </ErrorBoundary>
          </MotionPreference>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
