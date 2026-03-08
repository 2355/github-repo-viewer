import type { ApiResult } from "@/infra/types";

import { repositorySchema, searchRepositoriesResponseSchema } from "./schemas";
import type { Repository, SearchRepositoriesResult } from "./types";

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
): Promise<ApiResult<SearchRepositoriesResult>> {
  if (page > MAX_PAGE) {
    return {
      ok: false,
      error: {
        status: 422,
        message: `Page number exceeds maximum of ${MAX_PAGE}`,
      },
    };
  }

  const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${PER_PAGE}`;
  const response = await fetch(url, { headers: defaultHeaders });

  if (!response.ok) {
    return {
      ok: false,
      error: {
        status: response.status,
        message: `GitHub API error: ${response.status} ${response.statusText}`,
      },
    };
  }

  const json: unknown = await response.json();
  const parsed = searchRepositoriesResponseSchema.safeParse(json);

  if (!parsed.success) {
    return {
      ok: false,
      error: { status: 500, message: "Invalid API response" },
    };
  }

  return {
    ok: true,
    data: {
      items: parsed.data.items,
      total_pages: Math.min(
        Math.ceil(parsed.data.total_count / PER_PAGE),
        MAX_PAGE,
      ),
    },
  };
}

export async function getRepository(
  owner: string,
  repo: string,
): Promise<ApiResult<Repository>> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
  const response = await fetch(url, {
    headers: defaultHeaders,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return {
      ok: false,
      error: {
        status: response.status,
        message: `GitHub API error: ${response.status} ${response.statusText}`,
      },
    };
  }

  const json: unknown = await response.json();
  const parsed = repositorySchema.safeParse(json);

  if (!parsed.success) {
    return {
      ok: false,
      error: { status: 500, message: "Invalid API response" },
    };
  }

  return { ok: true, data: parsed.data };
}
