import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Repository } from "@/infra/github/types";

import { RepositoryCard } from "./RepositoryCard";

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

const meta = {
  component: RepositoryCard,
} satisfies Meta<typeof RepositoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    repository: baseRepository,
  },
};

export const LongName: Story = {
  args: {
    repository: {
      ...baseRepository,
      name: "this-is-a-very-long-repository-name-that-might-cause-layout-issues",
      full_name:
        "octocat/this-is-a-very-long-repository-name-that-might-cause-layout-issues",
    },
  },
};
