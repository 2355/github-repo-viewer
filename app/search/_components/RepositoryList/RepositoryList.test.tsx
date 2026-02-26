import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Repository } from "@/infra/github/types";

import { RepositoryList } from "./RepositoryList";

const baseRepository: Repository = {
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

const repositories: Repository[] = [
  baseRepository,
  {
    ...baseRepository,
    name: "vue",
    full_name: "vuejs/vue",
    owner: { login: "vuejs", avatar_url: "https://example.com/vue.png" },
  },
];

const defaultProps = {
  repositories,
  totalPages: 3,
  currentPage: 1,
  onPageChange: vi.fn(),
  isLoading: false,
  isError: false,
};

describe("RepositoryList", () => {
  it("リポジトリ一覧を表示する", () => {
    render(<RepositoryList {...defaultProps} />);

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("vue")).toBeInTheDocument();
  });

  it("totalPages > 1 のときページネーションを表示する", () => {
    render(<RepositoryList {...defaultProps} totalPages={3} />);

    expect(
      screen.getByRole("navigation", { name: "pagination" }),
    ).toBeInTheDocument();
  });

  it("ページネーション操作で onPageChange が呼ばれる", async () => {
    const onPageChange = vi.fn();
    render(
      <RepositoryList
        {...defaultProps}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    await userEvent.click(screen.getByLabelText("次のページへ"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("totalPages <= 1 のときページネーションを表示しない", () => {
    render(<RepositoryList {...defaultProps} totalPages={1} />);

    expect(
      screen.queryByRole("navigation", { name: "pagination" }),
    ).not.toBeInTheDocument();
  });

  it("isLoading のときスケルトンを表示する", () => {
    render(
      <RepositoryList {...defaultProps} isLoading={true} repositories={[]} />,
    );

    const skeletons = screen.getAllByTestId("skeleton-item");
    expect(skeletons).toHaveLength(5);
    expect(screen.queryByText("react")).not.toBeInTheDocument();
  });

  it("isError のときエラーメッセージを表示する", () => {
    render(
      <RepositoryList {...defaultProps} isError={true} repositories={[]} />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "エラーが発生しました。しばらくしてから再度お試しください。",
    );
  });

  it("repositories が空のとき「検索結果がありません」を表示する", () => {
    render(
      <RepositoryList {...defaultProps} repositories={[]} totalPages={0} />,
    );

    expect(screen.getByText("検索結果がありません")).toBeInTheDocument();
  });
});
