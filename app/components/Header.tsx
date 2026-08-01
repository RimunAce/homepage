"use client";

import Link from "next/link";
import { memo } from "react";

function Header() {
  return (
    <>
      {/* Header */}
      <header className="bg-retro-black text-retro-white py-2 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">RESPIRE</h1>
          <span className="text-sm">KASANE</span>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-retro-white border-b-2 border-retro-black relative z-10" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="retro-button text-sm active:scale-95 transition-transform">
              HOME
            </Link>
            <Link href="/gallery" className="retro-button text-sm active:scale-95 transition-transform">
              GALLERY
            </Link>
            <Link href="/anilist" className="retro-button text-sm active:scale-95 transition-transform">
              MY ANILIST
            </Link>
            <Link href="/music" className="retro-button text-sm active:scale-95 transition-transform">
              MUSIC PLAYER
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default memo(Header);
