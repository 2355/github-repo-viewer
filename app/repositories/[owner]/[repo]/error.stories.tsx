import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import ErrorPage from "./error";

const meta = {
  component: ErrorPage,
  args: {
    error: new Error("Something went wrong"),
    reset: fn(),
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
