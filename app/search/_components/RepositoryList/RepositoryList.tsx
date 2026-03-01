import { Card, Skeleton } from "@radix-ui/themes";

import { RepositoryCard } from "@/app/search/_components/RepositoryCard/RepositoryCard";
import { Pagination } from "@/components/atoms/Pagination/Pagination";
import type { Repository } from "@/infra/github/types";

import styles from "./RepositoryList.module.css";

type RepositoryListProps = {
  repositories: Repository[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
};

export function RepositoryList({
  repositories,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
  isError,
}: RepositoryListProps) {
  if (isLoading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 5 }, (_, i) => (
          <Card key={i} size="2">
            <div className={styles.skeletonItem} data-testid="skeleton-item">
              <Skeleton width="40px" height="40px" />
              <Skeleton width="200px" height="20px" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.statusContainer} role="alert">
        <h2 className={styles.statusHeading}>エラーが発生しました</h2>
        <p className={styles.statusMessage}>
          データの取得中に問題が発生しました。しばらくしてから再度お試しください。
        </p>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className={styles.statusContainer}>
        <h2 className={styles.statusHeading}>検索結果がありません</h2>
        <p className={styles.statusMessage}>
          別のキーワードで検索してみてください。
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.list}>
        {repositories.map((repo) => (
          <RepositoryCard key={repo.full_name} repository={repo} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
