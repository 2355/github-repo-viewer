import { useQuery } from "@tanstack/react-query";

import { searchRepositories } from "@/infra/github/client";

export function useSearchRepositories(query: string, page: number) {
  return useQuery({
    queryKey: ["searchRepositories", query, page],
    queryFn: () => searchRepositories(query, page),
    enabled: query.trim().length > 0,
  });
}
