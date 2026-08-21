"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/anilist", label: "ANILIST" },
  { href: "/music", label: "MUSIC" },
] as const;

function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className="bg-retro-black text-retro-white py-2 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          <h1 className="text-lg font-bold">RESPIRE</h1>
          <span className="text-sm whitespace-nowrap">KASANE TETO</span>
        </div>
      </header>

      <nav
        className="bg-retro-white border-b-2 border-retro-black relative z-10"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {links.map((link) => {
              const current = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`retro-button text-sm active:scale-95 transition-transform ${
                    current ? "bg-retro-black text-retro-white" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

export default memo(Header);
