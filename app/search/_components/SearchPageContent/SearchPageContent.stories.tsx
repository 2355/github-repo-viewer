import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mocked } from "storybook/test";

import { useSearchRepositories } from "@/app/search/_hooks/useSearchRepositories";
import type { Repository } from "@/infra/github/types";

import { SearchPageContent } from "./SearchPageContent";

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

const repositories: Repository[] = Array.from({ length: 10 }, (_, i) => ({
  ...baseRepository,
  name: `react-repo-${i + 1}`,
  full_name: `facebook/react-repo-${i + 1}`,
}));

const meta = {
  component: SearchPageContent,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/search",
        query: {},
      },
    },
  },
  beforeEach: () => {
    mocked(useSearchRepositories).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useSearchRepositories>);
  },
} satisfies Meta<typeof SearchPageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "react" },
      },
    },
  },
  beforeEach: () => {
    mocked(useSearchRepositories).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useSearchRepositories>);
  },
};

export const WithResults: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "react" },
      },
    },
  },
  beforeEach: () => {
    mocked(useSearchRepositories).mockReturnValue({
      data: {
        items: repositories,
        total_pages: 3,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useSearchRepositories>);
  },
};

export const Error: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "react" },
      },
    },
  },
  beforeEach: () => {
    mocked(useSearchRepositories).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useSearchRepositories>);
  },
};

export const EmptyResults: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
        query: { q: "react" },
      },
    },
  },
  beforeEach: () => {
    mocked(useSearchRepositories).mockReturnValue({
      data: {
        items: [] as Repository[],
        total_pages: 0,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useSearchRepositories>);
  },
};
