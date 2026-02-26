import { render, screen } from "@testing-library/react";

import type { Repository } from "@/infra/github/types";

import { RepositoryCard } from "./RepositoryCard";

const repository: Repository = {
  name: "hello-world",
  full_name: "octocat/hello-world",
  owner: {
    login: "octocat",
    avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
  },
  description: "My first repository on GitHub!",
  language: "TypeScript",
  stargazers_count: 100,
  watchers_count: 100,
  forks_count: 50,
  open_issues_count: 10,
  html_url: "https://github.com/octocat/hello-world",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("RepositoryCard", () => {
  it("リポジトリ名を表示する", () => {
    render(<RepositoryCard repository={repository} />);
    expect(screen.getByText("hello-world")).toBeInTheDocument();
  });

  it("オーナーのアバター画像を表示する", () => {
    render(<RepositoryCard repository={repository} />);
    expect(screen.getByRole("img", { name: "octocat" })).toBeInTheDocument();
  });

  it("/repositories/{owner}/{repo} へのリンクになっている", () => {
    render(<RepositoryCard repository={repository} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/repositories/octocat/hello-world",
    );
  });
});
