import { render, screen } from "@testing-library/react";

import type { Repository } from "@/infra/github/types";

import { RepositoryDetail } from "./RepositoryDetail";

const repository: Repository = {
  name: "hello-world",
  full_name: "octocat/hello-world",
  owner: {
    login: "octocat",
    avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
  },
  description: "My first repository on GitHub!",
  language: "TypeScript",
  stargazers_count: 1234,
  watchers_count: 567,
  forks_count: 890,
  open_issues_count: 42,
  html_url: "https://github.com/octocat/hello-world",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("RepositoryDetail", () => {
  it("リポジトリのフルネームを見出しとして表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(
      screen.getByRole("heading", { name: "octocat/hello-world" }),
    ).toBeInTheDocument();
  });

  it("フルネームが GitHub への外部リンクになっている", () => {
    render(<RepositoryDetail repository={repository} />);
    const link = screen.getByRole("link", { name: "octocat/hello-world" });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/octocat/hello-world",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("リポジトリの説明を表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(
      screen.getByText("My first repository on GitHub!"),
    ).toBeInTheDocument();
  });

  it("description が null の場合、説明を表示しない", () => {
    render(
      <RepositoryDetail
        repository={{ ...repository, description: null }}
      />,
    );
    expect(
      screen.queryByText("My first repository on GitHub!"),
    ).not.toBeInTheDocument();
  });

  it("スター数を表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("ウォッチャー数を表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(screen.getByText("567")).toBeInTheDocument();
  });

  it("フォーク数を表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(screen.getByText("890")).toBeInTheDocument();
  });

  it("Issue 数を表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("言語を表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("language が null の場合、言語を表示しない", () => {
    render(
      <RepositoryDetail repository={{ ...repository, language: null }} />,
    );
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("オーナーのアバター画像を表示する", () => {
    render(<RepositoryDetail repository={repository} />);
    expect(
      screen.getByRole("img", { name: "octocat" }),
    ).toBeInTheDocument();
  });
});
