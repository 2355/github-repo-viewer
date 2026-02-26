import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SearchBar } from "./SearchBar";

const meta = {
  component: SearchBar,
  args: {
    onSearch: () => {},
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "react",
  },
};
