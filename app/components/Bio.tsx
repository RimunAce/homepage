import Link from "next/link";
import SafeImage from "./SafeImage";
import styles from "./home.module.css";

const routeLink =
  "inline-flex min-h-11 items-center text-sm font-semibold text-[#f2f3f6] underline decoration-white/35 underline-offset-4 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function Bio() {
  return (
    <section id="bio" className={styles.stage}>
      <figure className={styles.portrait}>
        <SafeImage
          src="https://syd.cloud.appwrite.io/v1/storage/buckets/gallery/files/teto-jpg/view?project=68f8d96a0021b0ae0895"
          alt="Kasane Teto portrait"
          width={960}
          height={960}
          sizes="(max-width: 1023px) 100vw, 62vw"
          priority
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </figure>
      <div className={styles.plate}>
        <div className={styles.plateCopy}>
          <div className={styles.companion}>
            <SafeImage
              src="https://syd.cloud.appwrite.io/v1/storage/buckets/gallery/files/teto/view?project=68f8d96a0021b0ae0895"
              alt="Kasane Teto standing beside the introduction"
              width={348}
              height={749}
              sizes="(min-width: 1280px) 11.5rem, (min-width: 1024px) 10rem, clamp(4.25rem, 19vw, 5.5rem)"
              className="h-auto w-full"
              style={{ height: "auto" }}
            />
          </div>
          <div className={styles.plateHeading}>
            <p className={styles.who}>Kasane Teto, who lives here</p>
            <h1 className={styles.title}>Live, Love, Accept.</h1>
          </div>
          <p className={styles.voice}>
            Enjoyer of many, hater of none(?). Kasane Teto is the redhead who lives here.
          </p>
          <p className={styles.job}>Developer and Forester.</p>
          <div className={styles.routes}>
            <Link href="/gallery" className={routeLink}>Photos</Link>
            <Link href="/anilist" className={routeLink}>Anime &amp; manga</Link>
            <Link href="/music" className={routeLink}>Music stays on</Link>
          </div>
          <p className={styles.note}>
            I rebuilt this place once. Then I rebuilt the rebuild. The old site is still up at{" "}
            <a
              href="https://other.respire.my"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f2f3f6] underline decoration-white/40 underline-offset-4 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              other.respire.my
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
