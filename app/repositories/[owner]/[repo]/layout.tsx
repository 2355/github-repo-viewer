import styles from "./layout.module.css";

export default function RepositoryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.container}>{children}</main>;
}
