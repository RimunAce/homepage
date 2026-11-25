import type { ReactNode } from "react";
import styles from "./home-drawer.module.css";

interface HomeDrawerProps {
  id: string;
  title: string;
  preview: string;
  children: ReactNode;
}

export default function HomeDrawer({ id, title, preview, children }: HomeDrawerProps) {
  return (
    <details id={id} className={styles.drawer} data-swarm-step>
      <summary className={styles.toggle}>
        <h2 className={styles.label}>
          <span className={styles.title}>{title}</span>
          <span className={styles.preview}>{preview}</span>
          <span className={styles.indicator} aria-hidden="true" />
        </h2>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
