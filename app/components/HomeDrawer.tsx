"use client";

import { useState, type ReactNode } from "react";
import styles from "./home-drawer.module.css";

interface HomeDrawerProps {
  id: string;
  title: string;
  preview: string;
  children: ReactNode;
}

export default function HomeDrawer({ id, title, preview, children }: HomeDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <section id={id} className={styles.drawer} data-open={open} data-swarm-step>
      <h2>
        <button
          type="button"
          id={`${id}-toggle`}
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.title}>{title}</span>
          <span className={styles.preview}>{preview}</span>
          <span className={styles.indicator} aria-hidden="true" />
        </button>
      </h2>
      <div
        id={`${id}-panel`}
        className={styles.reveal}
        role="region"
        aria-labelledby={`${id}-toggle`}
        inert={!open}
      >
        <div className={styles.clip}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </section>
  );
}
