"use client";

// TanStack Query の公式推奨パターンに従った QueryClient の初期化
// https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 時にクライアント側で即座に refetch しないよう staleTime を設定
        staleTime: 5 * 60 * 1000, // 5分
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // サーバー側では常に新しい QueryClient を生成
    return makeQueryClient();
  } else {
    // ブラウザ側では初回レンダリング時の Suspense による再生成を防ぐためシングルトンにする
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Suspense boundary がない場合に useState だと React が初回レンダリングで
  // クライアントを破棄するため、useState を使わずに getQueryClient() で取得する
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
