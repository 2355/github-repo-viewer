import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Repository } from "@/infra/github/types";

import { RepositoryList } from "./RepositoryList";

const baseRepository: Repository = {
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

const repositories: Repository[] = Array.from({ length: 10 }, (_, i) => ({
  ...baseRepository,
  name: `hoge${i + 1}`,
  full_name: `octocat/hoge${i + 1}`,
}));

const meta = {
  component: RepositoryList,
  args: {
    repositories,
    totalPages: 5,
    currentPage: 1,
    onPageChange: () => {},
    isLoading: false,
    isError: false,
  },
} satisfies Meta<typeof RepositoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    repositories: [],
  },
};

export const Error: Story = {
  args: {
    isError: true,
    repositories: [],
  },
};

export const Empty: Story = {
  args: {
    repositories: [],
    totalPages: 0,
  },
};
