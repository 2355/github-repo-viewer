import Link from "next/link";

import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <Link href="/search" className={styles.link}>
          GitHub Repository Viewer
        </Link>
      </h1>
    </header>
  );
}
