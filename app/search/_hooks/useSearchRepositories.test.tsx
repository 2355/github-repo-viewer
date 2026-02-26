import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { searchRepositories } from "@/infra/github/client";
import type { SearchRepositoriesResponse } from "@/infra/github/types";

import { useSearchRepositories } from "./useSearchRepositories";

vi.mock("@/infra/github/client", () => ({
  searchRepositories: vi.fn(),
}));

const mockSearchRepositories = vi.mocked(searchRepositories);

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

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useSearchRepositories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("クエリとページ番号を引数に searchRepositories を呼び、データを返す", async () => {
    mockSearchRepositories.mockResolvedValue(searchResponse);

    const { result } = renderHook(
      () => useSearchRepositories("next.js", 3),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockSearchRepositories).toHaveBeenCalledWith("next.js", 3);
    expect(result.current.data).toEqual(searchResponse);
  });

  it("クエリが空文字の場合、searchRepositories を呼ばない", () => {
    const { result } = renderHook(
      () => useSearchRepositories("", 1),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockSearchRepositories).not.toHaveBeenCalled();
  });

  it("クエリが空白のみの場合、searchRepositories を呼ばない", () => {
    const { result } = renderHook(
      () => useSearchRepositories("   ", 1),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockSearchRepositories).not.toHaveBeenCalled();
  });

  it("searchRepositories がエラーを throw した場合、isError が true になる", async () => {
    mockSearchRepositories.mockRejectedValue(
      new Error("GitHub API error: 403 Forbidden"),
    );

    const { result } = renderHook(
      () => useSearchRepositories("react", 1),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
