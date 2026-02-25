import "@radix-ui/themes/styles.css";
import "../app/tokens.css";
import "../app/globals.css";

import { Theme } from "@radix-ui/themes";
import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story) => (
      <Theme accentColor="blue" grayColor="slate" radius="medium">
        <Story />
      </Theme>
    ),
  ],
};

export default preview;
