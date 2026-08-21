import Image from "next/image";
import Link from "next/link";

export default function Bio() {
  return (
    <section id="bio" className="retro-card">
      <h2 className="retro-heading">ABOUT ME</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div
          className="w-32 h-32 border-2 border-retro-black flex-shrink-0"
          style={{ boxShadow: "4px 4px 0px #000000" }}
        >
          <Image
            src="https://cdn.apis.rocks/teto.jpg"
            alt="Respire"
            width={128}
            height={128}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="retro-text space-y-3 flex-1 min-w-0">
          <p>
            <span className="bg-retro-black text-retro-white px-1">
              Developer and Forester
            </span>
          </p>
          <p className="font-bold">
            Live, Love, Accept. Enjoyer of many, hater of none(?).
          </p>
          <p>
            Kasane Teto is the redhead who lives here. Photos in{" "}
            <Link href="/gallery" className="retro-link">
              Gallery
            </Link>
            . Anime and manga on{" "}
            <Link href="/anilist" className="retro-link">
              AniList
            </Link>
            .{" "}
            <Link href="/music" className="retro-link">
              Music
            </Link>{" "}
            stays on.
          </p>
          <p>I enjoy doing whatever. Yes, red head over here doing red head thing.</p>
        </div>
      </div>
      <p className="retro-text text-xs opacity-70 mt-4 pt-3 border-t border-retro-black">
        The old respire.my was too overdone. Let&apos;s change the mood a bit.
        Welcome to this new one. You can still check the old web here:{" "}
        <a
          href="https://other.respire.my"
          target="_blank"
          rel="noopener noreferrer"
          className="retro-link"
        >
          https://other.respire.my
        </a>
      </p>
    </section>
  );
}
