import Script from "next/script";

const WEBRING_SRC =
  "https://raw.githubusercontent.com/xjunko/webrings/master/webring.json";
const WEBRING_SCRIPT =
  "https://cdn.jsdelivr.net/gh/diamondburned/libwebring@nightly/dist/webring-element.js";
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
  return link.includes("://") ? link : `https://${link}`;
}

function surroundingLinks(ring: RingLink[], name: string) {
  const index = ring.findIndex(
    (member) => member.name === name || member.link === "respire.my",
  );
  if (index < 0) return null;

  return {
    left: ring[(index - 1 + ring.length) % ring.length],
    current: ring[index],
    right: ring[(index + 1) % ring.length],
  };
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
  const around =
    surroundingLinks(webring.ring, MEMBER_NAME) ??
    surroundingLinks(FALLBACK_RING, MEMBER_NAME);

  if (!around) return null;

  return (
    <section id="webring" className="retro-card">
      <h2 className="retro-heading">WEBRING</h2>
      <Script src={WEBRING_SCRIPT} strategy="afterInteractive" type="module" />
      <webring-element name={MEMBER_NAME} src={WEBRING_SRC}>
        <p className="ring-info">
          <a
            href={webring.root}
            className="ring retro-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {webring.name}
          </a>{" "}
          webring
        </p>
        <p className="ring-body">
          <a
            className="left"
            href={toUrl(around.left.link)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {around.left.name}
          </a>
          <span className="middle">{around.current.name}</span>
          <a
            className="right"
            href={toUrl(around.right.link)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {around.right.name}
          </a>
        </p>
      </webring-element>
    </section>
  );
}
