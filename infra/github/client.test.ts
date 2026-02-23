import { getRepository, searchRepositories } from "./client";
import type { Repository, SearchRepositoriesResponse } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

describe("searchRepositories", () => {
  const searchResponse: SearchRepositoriesResponse = {
    total_count: 1,
    incomplete_results: false,
    items: [
      {
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
      },
    ],
  };

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(searchResponse),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("クエリとページ番号を含む正しい URL と Accept ヘッダーで fetch を呼ぶ", async () => {
    await searchRepositories("react", 2);

    expect(fetch).toHaveBeenCalledWith(
      `${GITHUB_API_BASE}/search/repositories?q=react&page=2`,
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
      `${GITHUB_API_BASE}/search/repositories?q=hello%20%E6%97%A5%E6%9C%AC&page=1`,
      expect.objectContaining({}),
    );
  });

  it("レスポンスの JSON をそのまま返す", async () => {
    const result = await searchRepositories("react", 1);

    expect(result).toEqual(searchResponse);
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
