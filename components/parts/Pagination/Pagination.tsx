import styles from "./Pagination.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = { type: "page"; page: number } | { type: "ellipsis" };

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: "page" as const,
      page: i + 1,
    }));
  }

  const items: PageItem[] = [];

  // 先頭付近: currentPage <= 4 → [1][2][3][4][5]…[last]
  if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) {
      items.push({ type: "page", page: i });
    }
    items.push({ type: "ellipsis" });
    items.push({ type: "page", page: totalPages });
    return items;
  }

  // 末尾付近: currentPage >= totalPages - 3 → [1]…[last-4][last-3][last-2][last-1][last]
  if (currentPage >= totalPages - 3) {
    items.push({ type: "page", page: 1 });
    items.push({ type: "ellipsis" });
    for (let i = totalPages - 4; i <= totalPages; i++) {
      items.push({ type: "page", page: i });
    }
    return items;
  }

  // 中間: [1]…[cur-1][cur][cur+1]…[last]
  items.push({ type: "page", page: 1 });
  items.push({ type: "ellipsis" });
  items.push({ type: "page", page: currentPage - 1 });
  items.push({ type: "page", page: currentPage });
  items.push({ type: "page", page: currentPage + 1 });
  items.push({ type: "ellipsis" });
  items.push({ type: "page", page: totalPages });

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const items = buildPageItems(currentPage, totalPages);

  return (
    <nav aria-label="pagination" className={styles.nav}>
      <button
        className={styles.button}
        disabled={currentPage === 1}
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
        aria-label="前のページへ"
      >
        ‹
      </button>
      {items.map((item, index) =>
        item.type === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={item.page}
            className={`${styles.button} ${item.page === currentPage ? styles.active : ""}`}
            aria-current={item.page === currentPage ? "page" : undefined}
            onClick={() => {
              onPageChange(item.page);
            }}
          >
            {item.page}
          </button>
        ),
      )}
      <button
        className={styles.button}
        disabled={currentPage === totalPages}
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
        aria-label="次のページへ"
      >
        ›
      </button>
    </nav>
  );
}
