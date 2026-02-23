import "@radix-ui/themes/styles.css";
import "./tokens.css";
import "./globals.css";

import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";

import { QueryProvider } from "./providers";

export const metadata: Metadata = {
  title: "GitHub Repository Viewer",
  description: "Search and browse GitHub repositories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Theme accentColor="blue" grayColor="slate" radius="medium">
          <QueryProvider>{children}</QueryProvider>
        </Theme>
      </body>
    </html>
  );
}
