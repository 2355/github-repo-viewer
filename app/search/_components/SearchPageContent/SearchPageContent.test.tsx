import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Repository } from "@/infra/github/types";

import { SearchPageContent } from "./SearchPageContent";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("../../_hooks/useSearchRepositories", () => ({
  useSearchRepositories: vi.fn(),
}));

import { useSearchParams } from "next/navigation";

import { useSearchRepositories } from "../../_hooks/useSearchRepositories";

const mockedUseSearchParams = vi.mocked(useSearchParams);
const mockedUseSearchRepositories = vi.mocked(useSearchRepositories);

const baseRepository: Repository = {
  name: "react",
  full_name: "facebook/react",
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
  },
  description: "A JavaScript library for building user interfaces.",
  language: "JavaScript",
  stargazers_count: 200000,
  watchers_count: 6500,
  forks_count: 42000,
  open_issues_count: 1000,
  html_url: "https://github.com/facebook/react",
  updated_at: "2025-01-01T00:00:00Z",
};

function setupSearchParams(params: Record<string, string>) {
  const urlSearchParams = new URLSearchParams(params);
  mockedUseSearchParams.mockReturnValue(urlSearchParams as never);
}

function setupHookResult(
  overrides: Partial<ReturnType<typeof useSearchRepositories>> = {},
) {
  mockedUseSearchRepositories.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    ...overrides,
  } as ReturnType<typeof useSearchRepositories>);
}

describe("SearchPageContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupSearchParams({});
    setupHookResult();
  });

  it("SearchBar が表示される", () => {
    render(<SearchPageContent />);

    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("q パラメータがないとき RepositoryList を表示しない", () => {
    render(<SearchPageContent />);

    expect(screen.queryByTestId("skeleton-item")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("検索結果がありません")).not.toBeInTheDocument();
  });

  it("q パラメータの値が SearchBar の初期値に反映される", () => {
    setupSearchParams({ q: "react" });
    setupHookResult();

    render(<SearchPageContent />);

    expect(screen.getByRole("searchbox")).toHaveValue("react");
  });

  it("q と page が useSearchRepositories に渡される", () => {
    setupSearchParams({ q: "react", page: "3" });
    setupHookResult();

    render(<SearchPageContent />);

    expect(mockedUseSearchRepositories).toHaveBeenCalledWith("react", 3);
  });

  it("page 未指定のとき 1 がデフォルト", () => {
    setupSearchParams({ q: "react" });
    setupHookResult();

    render(<SearchPageContent />);

    expect(mockedUseSearchRepositories).toHaveBeenCalledWith("react", 1);
  });

  it("page が不正値のとき 1 にフォールバック", () => {
    setupSearchParams({ q: "react", page: "abc" });
    setupHookResult();

    render(<SearchPageContent />);

    expect(mockedUseSearchRepositories).toHaveBeenCalledWith("react", 1);
  });

  it("検索実行で URL が更新される", async () => {
    setupSearchParams({ q: "react" });
    setupHookResult();

    render(<SearchPageContent />);

    const searchbox = screen.getByRole("searchbox");
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, "next.js{Enter}");

    expect(mockPush).toHaveBeenCalledWith("/search?q=next.js&page=1");
  });

  it("検索実行でページが 1 にリセットされる", async () => {
    setupSearchParams({ q: "react", page: "3" });
    setupHookResult();

    render(<SearchPageContent />);

    const searchbox = screen.getByRole("searchbox");
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, "vue{Enter}");

    expect(mockPush).toHaveBeenCalledWith("/search?q=vue&page=1");
  });

  it("ページ変更で URL が更新される", async () => {
    setupSearchParams({ q: "react", page: "1" });
    setupHookResult({
      data: {
        items: [baseRepository],
        total_pages: 3,
      },
    });

    render(<SearchPageContent />);

    await userEvent.click(screen.getByLabelText("次のページへ"));

    expect(mockPush).toHaveBeenCalledWith("/search?q=react&page=2");
  });

  it("検索結果が表示される", () => {
    setupSearchParams({ q: "react" });
    setupHookResult({
      data: {
        items: [baseRepository],
        total_pages: 1,
      },
    });

    render(<SearchPageContent />);

    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("ローディング中はスケルトンが表示される", () => {
    setupSearchParams({ q: "react" });
    setupHookResult({ isLoading: true });

    render(<SearchPageContent />);

    expect(screen.getAllByTestId("skeleton-item")).toHaveLength(5);
  });

  it("エラー時はエラーメッセージが表示される", () => {
    setupSearchParams({ q: "react" });
    setupHookResult({ isError: true });

    render(<SearchPageContent />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
