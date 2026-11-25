import type { Metadata, Viewport } from "next";
import "./globals.css";
import AgentSwarm from "./components/AgentSwarm";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import MusicPlayer from "./components/MusicPlayer";
import Background from "./components/Background";
import Header from "./components/Header";
import NewsTicker from "./components/NewsTicker";
import { ErrorBoundary } from "./components/ErrorBoundary";
import MotionPreference from "./components/MotionPreference";
import SiteFooter from "./components/SiteFooter";
import { personDescription } from "./lib/site-identity";

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
      description: personDescription,
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
    icon: "https://syd.cloud.appwrite.io/v1/storage/buckets/gallery/files/teto-jpg/view?project=68f8d96a0021b0ae0895",
    apple: "https://syd.cloud.appwrite.io/v1/storage/buckets/gallery/files/teto-jpg/view?project=68f8d96a0021b0ae0895",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090b10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090b10] text-[#f2f3f6]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MusicPlayerProvider>
          <MotionPreference>
            <AgentSwarm>
              <a
                href="#main-content"
                 className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:border focus:border-white/20 focus:bg-[#202531] focus:px-3 focus:py-2 focus:text-white"
              >
                Skip to content
              </a>

              <div className="relative min-h-screen bg-transparent">
                <Background />
                <div data-swarm-step><Header /></div>
                <ErrorBoundary>
                  <div data-swarm-step><NewsTicker /></div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div data-swarm-route>{children}</div>
                </ErrorBoundary>
                <div data-swarm-step><SiteFooter /></div>
              </div>
              <ErrorBoundary>
                <MusicPlayer />
              </ErrorBoundary>
            </AgentSwarm>
          </MotionPreference>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
