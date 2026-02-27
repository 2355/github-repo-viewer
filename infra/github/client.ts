import type {
  Repository,
  SearchRepositoriesResponse,
  SearchRepositoriesResult,
} from "./types";

const GITHUB_API_BASE = "https://api.github.com";
const PER_PAGE = 10;
// GitHub Search API は最初の 1000 件しか返せないため、per_page=10 のとき最大 100 ページ
const MAX_PAGE = 100;

const defaultHeaders: HeadersInit = {
  Accept: "application/vnd.github+json",
};

export async function searchRepositories(
  query: string,
  page: number,
): Promise<SearchRepositoriesResult> {
  if (page > MAX_PAGE) {
    throw new Error(`Page number exceeds maximum of ${MAX_PAGE}`);
  }

  const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${PER_PAGE}`;
  const response = await fetch(url, { headers: defaultHeaders });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as SearchRepositoriesResponse;
  return {
    items: data.items,
    total_pages: Math.min(Math.ceil(data.total_count / PER_PAGE), MAX_PAGE),
  };
}

export async function getRepository(
  owner: string,
  repo: string,
): Promise<Repository> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
  const response = await fetch(url, { headers: defaultHeaders });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<Repository>;
}
