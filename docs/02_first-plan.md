# GitHub Repository Viewer 実装計画

## Context

GitHub のリポジトリを検索・閲覧する Next.js Web アプリを構築する。現状は `create-next-app` で初期化済みの状態（`app/` がルート直下）。仕様書 (`docs/00_spec.md`) と技術スタック (`docs/01_tech-stack.md`) に基づき、検索画面とリポジトリ詳細画面の2画面を実装する。

## 技術選定（合意済み）

- **API**: GitHub REST API（認証なし。後から認証を追加できるよう infra 層に集約）
  - 検索画面: TanStack Query（Client Component）
  - 詳細画面: Server Component で直接 fetch
- **スタイル**: CSS Modules + typed-css-modules + Radix Themes（インタラクティブ要素のみ）+ デザイントークン（`app/tokens.css`）
- **テスト**: vitest + testing-library/react + happy-dom
- **構成**: app/ 内コロケーション + ルート直下に共有 components/
- **状態管理**: 専用ライブラリなし。サーバー状態は TanStack Query、クライアント状態は URL パラメータ + コンポーネントローカル state

## URL 設計

| 画面     | URL                                 |
| -------- | ----------------------------------- |
| トップ   | `/` → `/search` にリダイレクト      |
| 検索画面 | `/search?q={keyword}&page={number}` |
| 詳細画面 | `/repositories/{owner}/{repo}`      |

- 検索キーワードとページ番号は URL クエリパラメータで管理し、ブラウザバック・URL 共有に対応する
- TanStack Query の queryKey に `[q, page]` を含め、同一条件はキャッシュから返す

## Loading / Error 戦略

| 画面                         | ローディング                                         | エラー                                             |
| ---------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| 検索画面（Client Component） | TanStack Query の `isLoading` で検索結果部分のみ表示 | TanStack Query の `isError` で検索結果部分のみ表示 |
| 詳細画面（Server Component） | `loading.tsx`（ヘッダーを除く全体）                  | `error.tsx`（ヘッダーを除く全体）                  |

## レスポンシブ方針

- 初期は PC のみ対応
- SP 対応が必要になったときに media query を追加しやすいよう、トークンベースの spacing と `max-width` を使う

## GitHub API Rate Limit

- 初期実装では認証なし（未認証: 10 req/min）
- Rate Limit エラー時は検索結果 / 詳細画面にエラーメッセージを表示
- API クライアント (`infra/github/client.ts`) にヘッダー設定を集約し、後から認証トークンを注入できる設計にする

## ディレクトリ構成

```
(root)
├── app/
│   ├── layout.tsx                        # ルートレイアウト (Header 配置)
│   ├── layout.module.css
│   ├── globals.css                       # グローバルスタイル
│   ├── tokens.css                        # デザイントークン（CSS custom properties）
│   ├── page.tsx                          # / → /search にリダイレクト
│   │
│   ├── search/
│   │   ├── page.tsx                      # 検索画面 (Client Component)
│   │   ├── page.module.css
│   │   ├── _components/
│   │   │   ├── SearchBar/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SearchBar.module.css
│   │   │   │   └── SearchBar.test.tsx
│   │   │   ├── RepositoryList/
│   │   │   │   ├── RepositoryList.tsx
│   │   │   │   ├── RepositoryList.module.css
│   │   │   │   └── RepositoryList.test.tsx
│   │   │   └── RepositoryCard/
│   │   │       ├── RepositoryCard.tsx
│   │   │       ├── RepositoryCard.module.css
│   │   │       └── RepositoryCard.test.tsx
│   │   └── _hooks/
│   │       └── useSearchRepositories.ts
│   │
│   └── repositories/
│       └── [owner]/
│           └── [repo]/
│               ├── page.tsx              # 詳細画面 (Server Component)
│               ├── page.module.css
│               ├── loading.tsx           # ローディング UI
│               ├── error.tsx             # エラー UI
│               └── _components/
│                   └── RepositoryDetail/
│                       ├── RepositoryDetail.tsx
│                       ├── RepositoryDetail.module.css
│                       └── RepositoryDetail.test.tsx
│
├── components/                           # 共有コンポーネント
│   ├── atoms/
│   │   └── Pagination/
│   │       ├── Pagination.tsx
│   │       ├── Pagination.module.css
│   │       └── Pagination.test.tsx
│   └── organisms/
│       └── Header/
│           ├── Header.tsx
│           ├── Header.module.css
│           └── Header.test.tsx
│
├── infra/                                # 外部サービス接続層
│   └── github/
│       ├── client.ts                     # searchRepositories(), getRepository()
│       └── types.ts                      # GitHub API レスポンス型
│
├── test/                                 # テスト共通設定
│   └── setup.ts
│
├── docs/                                 # 仕様書 (既存)
└── (config files)                        # next.config.ts, tsconfig.json, etc.
```

## 実装ステップ

TDD で進める。各ステップで「テスト作成 → 失敗確認 → コミット → 実装 → テスト通過確認」の流れ。

README の AI 利用レポートは最後にまとめず、各ステップの完了時に都度追記する。

### Step 0: プロジェクト基盤セットアップ

#### Step 0-1: ボイラープレート削除

- デフォルトのテンプレートコード削除（app/page.tsx, globals.css 等）

#### Step 0-2: Prettier

- Prettier の導入・設定
- ESLint との統合（eslint-config-prettier）

#### Step 0-3: ESLint 設定の調整

- 既存の ESLint 設定の確認・必要に応じた調整

#### Step 0-4: テスト環境

- vitest + @testing-library/react + happy-dom の導入・設定
- `test/setup.ts` の作成

#### Step 0-5: typed-css-modules

- typed-css-modules の導入・設定

#### Step 0-6: Radix Themes + デザイントークン

- Radix Themes の導入・設定
- `app/tokens.css` の作成（spacing, typography, color, radius, shadow）

#### Step 0-7: TanStack Query

- `@tanstack/react-query` の導入
- QueryClientProvider の設定

### Step 1: infra 層 — GitHub API クライアント

#### Step 1-1: 型定義

- `infra/github/types.ts`: SearchRepositoriesResponse, Repository 等の型定義

#### Step 1-2: searchRepositories

- `infra/github/client.ts`: `searchRepositories(query, page)` 関数
- fetch ヘッダーを集約し、後から認証トークンを注入できる構造にする
- テスト: fetch モックによる単体テスト

#### Step 1-3: getRepository

- `infra/github/client.ts`: `getRepository(owner, repo)` 関数
- テスト: fetch モックによる単体テスト

### Step 2: 共通コンポーネント

#### Step 2-1: Header

- `components/organisms/Header/`: タイトルバー

#### Step 2-2: Pagination

- `components/atoms/Pagination/`: ページネーション UI（現在ページ、総ページ数、ページ変更コールバック）

### Step 3: 検索画面

#### Step 3-1: SearchBar

- `app/search/_components/SearchBar/`: 検索窓 + 検索ボタン

#### Step 3-2: RepositoryCard

- `app/search/_components/RepositoryCard/`: 一覧の1行（オーナーアイコン + リポ名、詳細画面へのリンク）

#### Step 3-3: useSearchRepositories

- `app/search/_hooks/useSearchRepositories.ts`: TanStack Query ベースの検索 hook（queryKey に `[q, page]` を含める）

#### Step 3-4: RepositoryList

- `app/search/_components/RepositoryList/`: RepositoryCard + Pagination を組み合わせた一覧（ローディング・エラー表示含む）

#### Step 3-5: 検索画面の組み立て

- `app/search/page.tsx`: 上記を組み合わせた検索画面（Client Component、URL クエリパラメータと同期）
- `app/page.tsx`: `/` → `/search` へのリダイレクト

### Step 4: 詳細画面

#### Step 4-1: RepositoryDetail

- `app/repositories/[owner]/[repo]/_components/RepositoryDetail/`: 詳細表示（アイコン、リポ名、言語、Star/Watcher/Fork/Issue数）

#### Step 4-2: 詳細画面の組み立て

- `app/repositories/[owner]/[repo]/page.tsx`: Server Component、`infra/github/client.ts` の `getRepository()` を直接呼び出し

#### Step 4-3: Loading / Error UI

- `app/repositories/[owner]/[repo]/loading.tsx`: ローディング UI
- `app/repositories/[owner]/[repo]/error.tsx`: エラー UI

### Step 5: 仕上げ

- グローバルスタイル調整

### Step 6: CI

- GitHub Actions の設定（lint, type check, test）

### Step 7: Storybook

#### Step 7-1: Storybook 導入

- Storybook の導入・設定

#### Step 7-2: Stories 作成

- 各コンポーネントの Stories 作成

#### Step 7-3: Storybook デプロイ

- GitHub Actions で Storybook を GitHub Pages にデプロイ

### Step 8: E2E テスト

#### Step 8-1: Playwright 導入

- Playwright の導入・設定

#### Step 8-2: E2E テスト作成

- 主要フロー（検索 → 結果表示 → 詳細遷移）の E2E テスト

#### Step 8-3: CI に E2E テストを追加

- GitHub Actions の CI に E2E テストを追加

### Step 9: Vercel デプロイ

- Vercel へのデプロイ設定
- GitHub Actions の CD 設定

## 検証方法

- `pnpm test`: すべてのテストが通ること
- `pnpm build`: ビルドが成功すること
- `pnpm dev`: ブラウザから動作確認（検索 → 結果表示 → 詳細遷移）
- `pnpm lint`: lint エラーがないこと
