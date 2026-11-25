import styles from "./webring.module.css";

export default function WebringPlanet() {
  return (
    <svg viewBox="0 0 720 500" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="orbit-atmosphere">
          <stop stopColor="#587d99" stopOpacity=".4" />
          <stop offset="1" stopColor="#587d99" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orbit-sphere" cx=".32" cy=".22" r=".78">
          <stop stopColor="#fce4b2" />
          <stop offset=".36" stopColor="#ca8f65" />
          <stop offset=".71" stopColor="#75435b" />
          <stop offset=".93" stopColor="#25253e" />
          <stop offset="1" stopColor="#121b30" />
        </radialGradient>
        <linearGradient id="orbit-rings" x1="-240" y1="80" x2="220" y2="-80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#576786" stopOpacity=".1" />
          <stop offset=".24" stopColor="#b18f94" />
          <stop offset=".52" stopColor="#f7d9a0" />
          <stop offset=".82" stopColor="#9c9ab1" />
          <stop offset="1" stopColor="#576786" stopOpacity=".1" />
        </linearGradient>
        <clipPath id="orbit-disc"><circle r="118" /></clipPath>
      </defs>

      <circle cx="365" cy="238" r="231" fill="url(#orbit-atmosphere)" />
      <g stroke="#afc9e5" strokeOpacity=".24">
        <circle cx="365" cy="238" r="187" strokeDasharray="1 6" />
        <circle cx="365" cy="238" r="214" strokeDasharray="26 8 2 8" />
        <path d="M365 12v24m0 404v24M139 238h24m404 0h24" />
      </g>
      <g transform="translate(365 238) rotate(-22)">
        <g stroke="url(#orbit-rings)">
          <ellipse rx="241" ry="76" strokeWidth="2" />
          <ellipse rx="220" ry="66" strokeWidth="14" opacity=".56" />
          <ellipse rx="202" ry="59" strokeWidth="15" opacity=".64" />
          <ellipse rx="182" ry="52" strokeWidth="12" opacity=".42" />
          <ellipse rx="161" ry="44" strokeWidth="2" />
        </g>
        <circle r="118" fill="url(#orbit-sphere)" stroke="#d7ae8d" strokeOpacity=".6" />
        <g clipPath="url(#orbit-disc)">
          <path d="M-120-79Q-20-55 120-92M-122-52Q-14-24 124-61M-124-12Q-8 17 124-25M-124 29Q-7 51 124 10M-122 61Q-5 87 122 46" stroke="#f4c9a3" strokeWidth="9" opacity=".24" />
          <path d="M-126-65Q-2-37 126-80M-124-31Q-3-7 124-46M-124 8Q-4 35 124-6M-124 46Q-9 70 124 26M-124 79Q-14 104 124 67" stroke="#3d284b" strokeWidth="13" opacity=".25" />
          <path d="M-120 0A120 34 0 0 0 120 0" transform="translate(0 6)" stroke="#271c35" strokeWidth="20" opacity=".4" />
        </g>
        <foreignObject x="-118" y="-118" width="236" height="236">
          <canvas className={styles.sphere} data-sphere="0" width={160} height={160} />
        </foreignObject>
        <g stroke="url(#orbit-rings)">
          <path d="M-241 0a241 76 0 0 0 482 0" strokeWidth="2" />
          <path d="M-220 0a220 66 0 0 0 440 0" strokeWidth="14" />
          <path d="M-202 0a202 59 0 0 0 404 0" strokeWidth="15" opacity=".84" />
          <path d="M-182 0a182 52 0 0 0 364 0" strokeWidth="12" opacity=".7" />
          <path d="M-161 0a161 44 0 0 0 322 0" strokeWidth="2" />
        </g>
        <path className={styles.ringGlint} d="M-213 0a213 64 0 0 0 426 0" pathLength="100" />
        <path className={`${styles.ringGlint} ${styles.ringGlintInner}`} d="M-191 0a191 55 0 0 0 382 0" pathLength="100" />
      </g>
      <g stroke="#d9e8f7" strokeOpacity=".58">
        <path d="M103 303l39 33 73 2m306-219 57-32 41 9" strokeDasharray="2 5" />
        <path d="M86 137h20m-10-10v20M607 323h18m-9-9v18M252 63h10m-5-5v10" />
      </g>
      <g fill="#e8edff">
        <circle cx="103" cy="303" r="3" />
        <circle cx="142" cy="336" r="2" />
        <circle cx="578" cy="87" r="3" />
        <circle cx="619" cy="96" r="2" />
        <circle cx="171" cy="170" r="2" />
        <circle cx="506" cy="398" r="2" />
        <circle cx="301" cy="425" r="1.5" />
      </g>
    </svg>
  );
}
