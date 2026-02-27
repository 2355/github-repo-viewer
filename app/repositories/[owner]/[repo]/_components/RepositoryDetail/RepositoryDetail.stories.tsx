import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Repository } from "@/infra/github/types";

import { RepositoryDetail } from "./RepositoryDetail";

const baseRepository: Repository = {
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

const meta = {
  component: RepositoryDetail,
} satisfies Meta<typeof RepositoryDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    repository: baseRepository,
  },
};

export const NoDescription: Story = {
  args: {
    repository: { ...baseRepository, description: null },
  },
};

export const NoLanguage: Story = {
  args: {
    repository: { ...baseRepository, language: null },
  },
};

export const LargeNumbers: Story = {
  args: {
    repository: {
      ...baseRepository,
      stargazers_count: 234567,
      watchers_count: 12345,
      forks_count: 98765,
      open_issues_count: 4321,
    },
  },
};

export const LongDescription: Story = {
  args: {
    repository: {
      ...baseRepository,
      description:
        "This is a very long description that might cause layout issues when rendered in the UI. It contains a lot of text to test how the component handles wrapping and overflow for lengthy repository descriptions that some users might write.",
    },
  },
};

export const Minimal: Story = {
  args: {
    repository: {
      ...baseRepository,
      description: null,
      language: null,
      stargazers_count: 0,
      watchers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
    },
  },
};
