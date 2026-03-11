# GitHub Repo Viewer

## 概要

GitHub リポジトリ検索・閲覧用 Web アプリ。検索画面とリポジトリ詳細画面の 2 画面構成。

## 技術スタック

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Radix UI Themes** — UI コンポーネント
- **CSS Modules** + **typed-css-modules** — スタイリング
- **TanStack React Query 5** — クライアント側データフェッチ
- **Zod 4** — API レスポンスバリデーション
- **Vitest 4** + **Testing Library** + **happy-dom** — テスト
- **Storybook 10** — コンポーネントカタログ
- **ESLint 9** + **Prettier 3** — リンター / フォーマッター
- **lefthook** — Git フック

## アーキテクチャ設計

### レイヤー構成

app/ · components/ · infra/ の 3 層構成。

- **app/** — ページ固有のコンポーネント・hooks を `_components/` `_hooks/` にコロケート。機能の追加・削除がディレクトリ単位で完結するため、不要になったコードがそのまま残るリスクを減らせる
  - コンポーネントの親子関係もディレクトリのネストで表現する
- **components/** — 複数ページで共有するコンポーネントを配置
  - parts/ : 汎用 UI パーツ (Pagination, Button など)
  - modules/ : 機能単位のコンポーネント (Header など)
  - Atomic Design (atoms/molecules/organisms) は分類の境界がチーム内でブレやすいため不採用。2 カテゴリに絞ることで「どちらに置くか」の判断コストを下げる
- **infra/** — 外部 API との通信を集約。UI 層が API の詳細（エンドポイント URL、レスポンス構造）に依存しないようにし、API 変更時の影響範囲を限定する。レスポンスには Result 型を利用し、呼び出し側にエラーハンドリングを強制する

### BFF（API Route）の非採用

本アプリは API Route を設けず、Server Component や React Query から `infra/github/client.ts` を直接呼び出している。

BFF を採用する主な理由は「API トークンの秘匿」「複数 API の集約・整形」「レートリミット制御」などだが、今回は GitHub REST API を認証なしで利用しており、データソースも単一であるため、いずれの理由にも該当しない。中間層を挟む複雑性に見合うメリットがなく、非採用とした。

### Server / Client Component の境界

App Router は Server Component がデフォルトであり、クライアント側の状態や副作用が必要な箇所だけを Client Component にするのが基本方針。

- **詳細画面（SC）** — データ取得がサーバー側で完結し、ユーザー操作による状態変化がない。ISR キャッシュで API リクエストを削減でき、`notFound()` による 404 処理もシンプルに実装できる
- **検索画面（CC）** — 検索キーワードの入力やページネーションなどユーザー操作に応じた状態管理が必要。React Query のクライアントキャッシュにより、ページ遷移や戻る・進む操作時の再フェッチを抑制する。CC の境界は `SearchPageContent` に設定し、`page.tsx` 自体は SC のまま保つ

### URL によるステート管理

検索キーワードやページ番号は URL クエリパラメーターで管理する。React の state ではなく URL を信頼できる情報源（Single Source of Truth）とすることで、ブラウザの戻る・進むで状態が復元され、URL の共有で同じ検索結果を再現できる。

## 技術選定の理由

### GitHub REST API

今回は 2 画面しかなく、複数のエンティティにまたがったデータの取得が不要であるため、シンプルな実装で済む REST を採用。

### CSS Modules + Radix Themes

- ピュアな CSS を使える構成を重視。標準 CSS が変数・ネスト・計算をサポートした現在、scss のメリットは薄い
- Tailwind 系は tsx にクラス名が大量に入り見通しが悪くなる点、素の CSS との併用で統一感が失われる点を懸念
- CSS-in-JS (emotion 等) はランタイムオーバーヘッドや RSC 非対応の制約がある
- typed-css-modules で型安全性も確保
- 独自デザインシステムへの移行を見据え、component library は最小限の利用に抑える（将来 Radix Primitives のみに移行しやすい構成）

### 独自定義の Result 型

- 現在は単一の API から値を取り出すだけなので、neverthrow などのライブラリを使うよりもシンプルな独自実装で十分と判断

### testing-library + happy-dom

- ユーザーの操作に近い形でブラックボックステストが書ける
- happy-dom は jsdom より高速・軽量

### lefthook

- pre-commit でコードの整形と型チェックを自動で行い、開発メンバー間でのコード品質のばらつきを減らす
- husky + lint-staged よりも設定がシンプル

### SC / CC の使い分け

- 詳細画面は Server Component — ISR キャッシュでパフォーマンスを向上し、`notFound()` で 404 処理もシンプルに実装できる
- 検索画面は Client Component — React Query によるクライアントキャッシュを活用し、ページ遷移や戻る・進む操作時の再フェッチを抑制する

### Zod

- `z.infer<typeof schema>` で API レスポンスの型をスキーマから推論し、`as` キャストを排除
- スキーマと型定義を単一の真実の源（Single Source of Truth）にすることで、API 変更時にスキーマ更新だけで型も追従

### ESLint strict type-checked + React Compiler

- strict type-checked で `no-floating-promises` 等を有効化し、ランタイムエラーをコンパイル時に検出
- `react-compiler/react-compiler` ルールで React 19 の自動メモ化を阻害するコードパターンを検出

## AI の利用方法

- Claude Code を利用
- 最初の設計段階の壁打ちから利用
  - ディレクトリ構成
  - 採用ライブラリ
- 実装も基本的に Claude Code に任せた
  - やりたいことを plan mode で何往復もしながら決め、最後にコード生成してもらう形
  - 生成されたコードに対して、自分の想定とは違うコードが出力された場合は、意図を確認し、不適切だと思った場合は指示を出し、修正させる
