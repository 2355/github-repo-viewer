import { useQuery } from "@tanstack/react-query";

import { searchRepositories } from "@/infra/github/client";

export function useSearchRepositories(query: string, page: number) {
  return useQuery({
    queryKey: ["searchRepositories", query, page],
    queryFn: async () => {
      const result = await searchRepositories(query, page);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    enabled: query.trim().length > 0,
  });
}
