import type { SearchRepositoriesResponse } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

const defaultHeaders: HeadersInit = {
  Accept: "application/vnd.github+json",
};

export async function searchRepositories(
  query: string,
  page: number,
): Promise<SearchRepositoriesResponse> {
  const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&page=${page}`;
  const response = await fetch(url, { headers: defaultHeaders });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<SearchRepositoriesResponse>;
}
