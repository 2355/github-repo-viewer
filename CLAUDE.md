# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub リポジトリ検索・閲覧用 Web アプリ。検索画面とリポジトリ詳細画面の 2 画面構成。

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Radix UI Themes** — UI コンポーネント（最小限の利用、将来 Radix Primitives のみに移行しやすくする意図）
- **CSS Modules** + **typed-css-modules (tcm)** — スタイリング。素の CSS を活用し、scss は不採用
- **TanStack React Query 5** — クライアント側データフェッチ（検索画面）
- **Zod 4** — API レスポンスのバリデーション（`as` キャストの排除）
- **Vitest 4** + **Testing Library** + **happy-dom** — テスト
- **Storybook 10** (`@storybook/nextjs-vite`)
- **ESLint 9** (strict type-checked + react-compiler + simple-import-sort + unused-imports) + **Prettier 3**
- **pnpm** — パッケージマネージャ

## Commands

```bash
pnpm dev              # 開発サーバ起動
pnpm build            # プロダクションビルド
pnpm test             # テスト実行 (vitest run)
pnpm test:watch       # テスト watch モード
pnpm lint             # ESLint
pnpm format           # Prettier チェック
pnpm format:fix       # Prettier 修正
pnpm tsc              # 型チェック (tsc --noEmit)
pnpm tcm              # CSS Modules 型定義生成
pnpm storybook        # Storybook 起動 (port 6006)
```

単一テストファイルの実行:

```bash
pnpm vitest run path/to/file.test.tsx
```

## Architecture

### ルーティング & 画面構成

- `/` — 検索画面（Client Component、React Query でデータフェッチ）
- `/repositories/[owner]/[repo]` — 詳細画面（Server Component、サーバー側で直接 API 呼び出し）

検索キーワード・ページ番号は URL クエリパラメーターで管理し、ブラウザの戻る・進むで状態を復元可能。

### ディレクトリ構造の方針

**コロケーション**: ページ固有のコンポーネント・hooks は各ルートの `_components/`, `_hooks/` に配置。

```
app/
  _components/SearchBar/, RepositoryList/, RepositoryCard/, SearchPageContent/
  _hooks/useSearchRepositories.ts
  page.tsx
  repositories/[owner]/[repo]/
    _components/RepositoryDetail/
    page.tsx, loading.tsx, error.tsx
components/
  atoms/Pagination/
  organisms/Header/
infra/
  github/client.ts, schemas.ts, types.ts
  types.ts              # ApiResult<T> 共通型
```

### コンポーネント構成規約

1 コンポーネント = 1 ディレクトリ:

```
ComponentName/
  ComponentName.tsx
  ComponentName.module.css
  ComponentName.module.css.d.ts  # tcm で自動生成
  ComponentName.test.tsx
  ComponentName.stories.tsx
```

### infra 層

- `infra/github/client.ts` — GitHub REST API クライアント (`searchRepositories`, `getRepository`)
- `infra/github/schemas.ts` — Zod スキーマ定義 & 型推論
- `infra/types.ts` — `ApiResult<T>` (Result 型パターン: `{ ok: true, data } | { ok: false, error }`)
- API レスポンスは Zod の `safeParse` でバリデーションし、`as` キャストは使わない

### データフロー

- **検索画面**: `useSearchRepositories` (React Query) → `searchRepositories()` → GitHub Search API
- **詳細画面**: Server Component の `page.tsx` → `getRepository()` → GitHub Repos API

### パスエイリアス

`@/*` → プロジェクトルート（`tsconfig.json` + `vitest.config.ts` で設定）

## Testing Conventions

- テストの describe / it は日本語で記述
- Testing Library でブラックボックステスト（ユーザー操作に近い形）
- Vitest globals 有効 (`describe`, `it`, `expect` をインポート不要)
- テスト環境: happy-dom
