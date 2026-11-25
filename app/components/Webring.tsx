import WebringPlanet from "./WebringPlanet";
import WebringParallax from "./WebringParallax";
import WebringSky from "./WebringSky";
import styles from "./webring.module.css";

const WEBRING_SRC =
  "https://raw.githubusercontent.com/xjunko/webrings/master/webring.json";
const MEMBER_NAME = "respy";

type RingLink = {
  name: string;
  link: string;
};

type WebringData = {
  name?: string;
  root?: string;
  ring?: RingLink[];
};

const FALLBACK_RING: RingLink[] = [
  { name: "junko", link: "kafu.ovh" },
  { name: "mystia", link: "mystialorelei.neocities.org" },
  { name: "zavents", link: "zavents.ovh" },
  { name: "respy", link: "respire.my" },
];

const FALLBACK_DATA: Required<WebringData> = {
  name: "PAKB",
  root: "https://github.com/xjunko/webrings",
  ring: FALLBACK_RING,
};

function toUrl(link: string) {
  try {
    const url = new URL(link.includes("://") ? link : `https://${link}`);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

async function loadWebring(): Promise<Required<WebringData>> {
  try {
    const res = await fetch(WEBRING_SRC, { next: { revalidate: 3600 } });
    if (!res.ok) return FALLBACK_DATA;

    const data = (await res.json()) as WebringData;
    if (!Array.isArray(data.ring) || data.ring.length === 0) {
      return FALLBACK_DATA;
    }

    return {
      name: data.name || FALLBACK_DATA.name,
      root: data.root || FALLBACK_DATA.root,
      ring: data.ring,
    };
  } catch {
    return FALLBACK_DATA;
  }
}

export default async function Webring() {
  const webring = await loadWebring();
  const homeIndex = webring.ring.findIndex((member) => member.name === MEMBER_NAME);
  const ring = homeIndex === -1 ? FALLBACK_RING : webring.ring;
  const index = homeIndex === -1 ? FALLBACK_RING.length - 1 : homeIndex;
  const neighbors = [...ring.slice(index + 1), ...ring.slice(0, index)].flatMap((member) => {
    const href = toUrl(member.link);
    return href ? [{ ...member, href }] : [];
  });
  const root = toUrl(webring.root) ?? FALLBACK_DATA.root;

  function planetLink(member: (typeof neighbors)[number], index: number) {
    return (
      <a key={member.href} className={styles.destination} data-planet={index % 3}
        href={member.href} target="_blank" rel="noopener noreferrer"
        aria-label={`Visit ${member.name} (opens in a new tab)`}
      >
        <span className={styles.world} aria-hidden="true">
          <canvas className={styles.sphere} data-sphere={index % 3 + 1} width={80} height={80} />
        </span>
        <span className={styles.worldName}>{member.name} <span aria-hidden="true">↗</span></span>
      </a>
    );
  }

  return (
    <section id="webring" className={styles.observatory} aria-labelledby="webring-title">
      <WebringSky />
      <header className={styles.intro}>
        <div>
          <p className={styles.catalog}>{webring.name} star chart</p>
          <h2 id="webring-title" className={styles.title}>Webring<span>.</span></h2>
        </div>
        <div className={styles.guide}>
          <p>Pick a planet in the sky or a site below. Either takes you there.</p>
          <a className={styles.index} href={root} target="_blank" rel="noopener noreferrer">View the {webring.name} ring <span aria-hidden="true">↗</span></a>
        </div>
      </header>
      <div className={styles.chart}>
        <WebringParallax>
          <div className={styles.farStars} aria-hidden="true" />
          <svg className={styles.trajectories} viewBox="0 0 600 470" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <ellipse cx="300" cy="225.6" rx="204" ry="141" />
            <ellipse cx="300" cy="225" rx="231" ry="163" transform="rotate(18 300 225)" />
            <ellipse className={styles.orbitSignal} cx="300" cy="225.6" rx="204" ry="141" pathLength="100" />
            <ellipse className={styles.orbitTrace} cx="300" cy="225.6" rx="204" ry="141" pathLength="100" />
          </svg>
          <div className={styles.planet}><WebringPlanet /></div>
          <div className={styles.homeWorld} aria-current="location">
            <strong>{MEMBER_NAME}</strong>
            <span>You are here</span>
          </div>
          <nav className={styles.system} aria-label={`${webring.name} planets`}>
            {neighbors.slice(0, 3).map(planetLink)}
          </nav>
        </WebringParallax>
      </div>
      {neighbors.length > 0 && (
        <nav className={styles.destinations} aria-label="Webring destinations">
          <div className={styles.dockTitle}>Destinations</div>
          <ul className={styles.dock}>
            {neighbors.map((member, index) => (
              <li key={member.href}>
                <a className={styles.dockLink} data-destination={index} href={member.href} target="_blank" rel="noopener noreferrer"
                  aria-label={`Visit ${member.name} (opens in a new tab)`}
                >
                  <span className={styles.dockMark} aria-hidden="true" />
                  <span className={styles.dockName}>
                    <strong>{member.name}</strong>
                    <span>{new URL(member.href).hostname}</span>
                  </span>
                  <span className={styles.dockArrow} aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
