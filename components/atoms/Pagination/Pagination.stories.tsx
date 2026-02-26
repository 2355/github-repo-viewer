import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Pagination } from "./Pagination";

const meta = {
  component: Pagination,
  args: {
    // render で onPageChange を上書きするが、型を満たすためにダミー値を設定
    onPageChange: () => {},
  },
  render: function PaginationStory(args) {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
  },
};
