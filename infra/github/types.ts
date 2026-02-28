export type { Owner, Repository, SearchRepositoriesResponse } from "./schemas";

export type SearchRepositoriesResult = {
  items: import("./schemas").Repository[];
  total_pages: number;
};
