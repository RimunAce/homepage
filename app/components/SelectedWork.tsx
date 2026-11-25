import Image from "next/image";
import styles from "./selected-work.module.css";

export default function SelectedWork() {
  return (
    <div className={styles.spread}>
      <article id="aquams" className={styles.feature}>
        <figure className={styles.preview}>
          <Image
            src="/images/work/air-monitoring.png"
            alt="AQUAMS dashboard showing an air quality index, recent trends, and pollutant readings"
            width={1620}
            height={1028}
            sizes="(min-width: 72rem) 630px, (min-width: 56rem) 55vw, 94vw"
          />
          <figcaption>Air quality overview</figcaption>
        </figure>
        <div className={styles.featureCopy}>
          <h3>AQUAMS</h3>
          <p className={styles.subtitle}>Air Quality Monitoring System in Schools</p>
          <p>
            Our specialists built the monitoring devices on-site. AQUAMS uses AI to forecast
            weather, predict air-quality changes, and flag unusual readings.
          </p>
        </div>
      </article>
      <article id="compliance-system" className={styles.secondary}>
        <figure className={styles.preview}>
          <Image
            src="/images/work/compliance.png"
            alt="Environmental compliance admin portal showing project assignments and system settings"
            width={1620}
            height={1028}
            sizes="(min-width: 72rem) 350px, (min-width: 56rem) 30vw, (min-width: 35rem) 45vw, 94vw"
          />
          <figcaption>Compliance portal</figcaption>
        </figure>
        <div className={styles.secondaryCopy}>
          <h3>Compliance System</h3>
          <p className={styles.subtitle}>Environmental Protection Department</p>
          <p>An internal system for tracking environmental compliance and reviewing reports on development projects.</p>
        </div>
      </article>
    </div>
  );
}
