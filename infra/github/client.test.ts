import { getRepository, searchRepositories } from "./client";
import type {
  Repository,
  SearchRepositoriesResponse,
  SearchRepositoriesResult,
} from "./types";

const GITHUB_API_BASE = "https://api.github.com";

describe("searchRepositories", () => {
  const item = {
    name: "react",
    full_name: "facebook/react",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    language: "JavaScript",
    stargazers_count: 200000,
    watchers_count: 6500,
    forks_count: 42000,
    open_issues_count: 1000,
    html_url: "https://github.com/facebook/react",
    updated_at: "2025-01-01T00:00:00Z",
  } satisfies Repository;

  const apiResponse: SearchRepositoriesResponse = {
    total_count: 45,
    incomplete_results: false,
    items: [item],
  };

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(apiResponse),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("クエリとページ番号と per_page を含む正しい URL と Accept ヘッダーで fetch を呼ぶ", async () => {
    await searchRepositories("react", 2);

    expect(fetch).toHaveBeenCalledWith(
      `${GITHUB_API_BASE}/search/repositories?q=react&page=2&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      },
    );
  });

  it("クエリが URL エンコードされる", async () => {
    await searchRepositories("hello 日本", 1);

    expect(fetch).toHaveBeenCalledWith(
      `${GITHUB_API_BASE}/search/repositories?q=hello%20%E6%97%A5%E6%9C%AC&page=1&per_page=10`,
      expect.objectContaining({}),
    );
  });

  it("API レスポンスを SearchRepositoriesResult に変換して返す", async () => {
    const result = await searchRepositories("react", 1);

    const expected: SearchRepositoriesResult = {
      items: [item],
      total_pages: 5,
    };
    expect(result).toEqual(expected);
  });

  it("レスポンスが ok でない場合はエラーを throw する", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      }),
    );

    await expect(searchRepositories("react", 1)).rejects.toThrow();
  });

  it("page が 101 以上の場合はエラーを throw する", async () => {
    await expect(searchRepositories("react", 101)).rejects.toThrow(
      "Page number exceeds maximum of 100",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("page が 100 の場合は正常に動作する", async () => {
    const result = await searchRepositories("react", 100);

    expect(result.items).toEqual([item]);
  });

  it("total_count が 1000 を超える場合 total_pages が 100 にキャップされる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            ...apiResponse,
            total_count: 1001,
          }),
      }),
    );

    const result = await searchRepositories("react", 1);

    expect(result.total_pages).toBe(100);
  });
});

describe("getRepository", () => {
  const repository: Repository = {
    name: "react",
    full_name: "facebook/react",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    language: "JavaScript",
    stargazers_count: 200000,
    watchers_count: 6500,
    forks_count: 42000,
    open_issues_count: 1000,
    html_url: "https://github.com/facebook/react",
    updated_at: "2025-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(repository),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("正しい URL と Accept ヘッダーで fetch を呼ぶ", async () => {
    await getRepository("facebook", "react");

    expect(fetch).toHaveBeenCalledWith(
      `${GITHUB_API_BASE}/repos/facebook/react`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      },
    );
  });

  it("レスポンスの JSON をそのまま返す", async () => {
    const result = await getRepository("facebook", "react");

    expect(result).toEqual(repository);
  });

  it("レスポンスが ok でない場合はエラーを throw する", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      }),
    );

    await expect(getRepository("facebook", "nonexistent")).rejects.toThrow();
  });
});
