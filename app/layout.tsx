import "@radix-ui/themes/styles.css";
import "./tokens.css";
import "./globals.css";

import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";

import { Header } from "@/components/organisms/Header/Header";

import styles from "./layout.module.css";
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
          <Header />
          <QueryProvider>
            <main className={styles.container}>{children}</main>
          </QueryProvider>
        </Theme>
      </body>
    </html>
  );
}
