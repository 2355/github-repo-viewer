"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useSearchRepositories } from "../../_hooks/useSearchRepositories";
import { RepositoryList } from "../RepositoryList/RepositoryList";
import { SearchBar } from "../SearchBar/SearchBar";
import styles from "./SearchPageContent.module.css";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useSearchRepositories(query, page);

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams({ q: newQuery, page: "1" });
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams({ q: query, page: String(newPage) });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <SearchBar key={query} defaultValue={query} onSearch={handleSearch} />
      {query && (
        <RepositoryList
          repositories={data?.items ?? []}
          totalPages={data?.total_pages ?? 0}
          currentPage={page}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </div>
  );
}
