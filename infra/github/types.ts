import type { Repository } from "./schemas";

export type { Owner, Repository, SearchRepositoriesResponse } from "./schemas";

export type SearchRepositoriesResult = {
  items: Repository[];
  total_pages: number;
};
