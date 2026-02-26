import { Card, Skeleton } from "@radix-ui/themes";

import { Pagination } from "@/components/atoms/Pagination/Pagination";
import type { Repository } from "@/infra/github/types";

import { RepositoryCard } from "../RepositoryCard/RepositoryCard";
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
          <Card key={i}>
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
      <p role="alert">
        エラーが発生しました。しばらくしてから再度お試しください。
      </p>
    );
  }

  if (repositories.length === 0) {
    return <p>検索結果がありません</p>;
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
