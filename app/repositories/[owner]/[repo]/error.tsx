"use client";

import { Button } from "@radix-ui/themes";
import Link from "next/link";

import styles from "./error.module.css";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className={styles.container} role="alert">
      <h2 className={styles.heading}>エラーが発生しました</h2>
      <p className={styles.message}>
        データの取得中に問題が発生しました。しばらくしてから再度お試しください。
      </p>
      <div className={styles.actions}>
        <Button onClick={reset}>再試行</Button>
        <Button variant="outline" asChild>
          <Link href="/search">検索に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
