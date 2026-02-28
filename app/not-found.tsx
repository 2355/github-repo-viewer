import { Button } from "@radix-ui/themes";
import Link from "next/link";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>ページが見つかりません</h2>
      <p className={styles.message}>
        お探しのページは存在しないか、削除された可能性があります。
      </p>
      <div className={styles.actions}>
        <Button variant="outline" asChild>
          <Link href="/">トップに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
