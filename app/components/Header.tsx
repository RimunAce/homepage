"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/anilist", label: "AniList" },
  { href: "/music", label: "Music" },
] as const;

function Header() {
  const pathname = usePathname();
  const wordmark = (
    <>
      Respire<span className="text-[#aeb5c4]">.my</span>
    </>
  );

  return (
    <header className="relative z-10 pb-4 pt-5 sm:pt-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="min-w-0">
          {pathname === "/" ? (
            <p className="font-display text-[1.65rem] font-extrabold leading-none tracking-[-0.045em] text-[#f2f3f6]">
              {wordmark}
            </p>
          ) : (
            <Link
              href="/"
              className="inline-flex min-h-11 items-center font-display text-[1.65rem] font-extrabold leading-none tracking-[-0.045em] text-[#f2f3f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {wordmark}
            </Link>
          )}
          <p className="mt-1 font-mono text-xs text-[#aeb5c4]">Kasane</p>
        </div>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-1">
          {links.map((link) => {
            const current = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-11 items-center border-b-2 px-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  current
                    ? "border-[#f2f3f6] font-semibold text-[#f2f3f6]"
                    : "border-transparent text-[#aeb5c4] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default memo(Header);
