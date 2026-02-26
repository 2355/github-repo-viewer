/**
 * GitHub REST API レスポンス型定義
 *
 * 参照:
 * - https://docs.github.com/en/rest/search/search#search-repositories
 * - https://docs.github.com/en/rest/repos/repos#get-a-repository
 *
 * アプリで使用するフィールドのみ定義し、不要なフィールドは含めない。
 * API レスポンスには他にも多数のフィールドがあるが、
 * 必要になった時点で追加する方針とする。
 */

export type Owner = {
  login: string;
  avatar_url: string;
};

export type Repository = {
  name: string;
  full_name: string;
  owner: Owner;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  updated_at: string;
};

export type SearchRepositoriesResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
};

export type SearchRepositoriesResult = {
  items: Repository[];
  total_pages: number;
};
