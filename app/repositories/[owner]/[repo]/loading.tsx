import { Card, Skeleton } from "@radix-ui/themes";

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <Skeleton
          width="64px"
          height="64px"
          data-testid="skeleton-avatar"
          style={{ borderRadius: "var(--radius-full)" }}
        />
        <Skeleton width="240px" height="30px" data-testid="skeleton" />
      </div>
      <Skeleton width="360px" height="20px" data-testid="skeleton" />
      <div className={styles.stats}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={styles.stat}>
            <Skeleton width="48px" height="24px" data-testid="skeleton-stat" />
            <Skeleton width="40px" height="14px" data-testid="skeleton" />
          </div>
        ))}
      </div>
      <Skeleton width="80px" height="24px" data-testid="skeleton" />
    </Card>
  );
}
