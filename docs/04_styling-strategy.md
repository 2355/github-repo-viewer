# スタイリング戦略

現在の仕様（`00_spec.md`）と技術スタック（`01_tech-stack.md`）を踏まえ、スタイリングの方針をまとめる。

## 1. 方針の概要

- **CSS Modules + CSS custom properties（デザイントークン）** がスタイリングの中心
- **Radix Themes** はインタラクティブなコンポーネント（Button, TextField, Select, Dialog 等）にのみ使用
- Text, Flex 等のレイアウト・タイポグラフィは CSS Modules で直接記述

## 2. UI ライブラリ: Radix Themes

### 選定理由

- **CSS Modules との親和性**: CSS 変数ベースのテーマシステムのため、CSS Modules から自然に参照できる
- **軽量**: 必要なコンポーネントだけを使い、バンドルサイズを抑えられる
- **アクセシビリティ**: WAI-ARIA 準拠。スクリーンリーダー・キーボード操作が標準で考慮されている
- **キーボード操作**: 仕様（`00_spec.md`）の「キーボード操作で完結する」要件と合致

### 利用範囲

インタラクティブなコンポーネントに限定する。

- Button, IconButton
- TextField, TextArea
- Select, Checkbox, RadioGroup
- Dialog, AlertDialog
- DropdownMenu
- Tooltip

### 不採用にした候補

- **Mantine**: 高機能だが独自のスタイルシステムへの依存が大きく、CSS Modules 中心の方針と噛み合わない
- **shadcn/ui**: Tailwind CSS が前提であり、CSS Modules との併用はプロジェクトの方針に反する

## 3. デザイントークン戦略

### トークンの定義

Radix Themes の CSS 変数名をベースに、`tokens.css` を自前で定義する。自前の CSS Modules はこのトークンを参照する。

### トークンカテゴリ

- **spacing**: 余白・ギャップ（`--space-1` 〜 `--space-9`）— 固定値
- **typography**: フォントサイズ・行間・ウェイト（`--font-size-1` 〜 `--font-size-9`）— 固定値
- **color**: テーマカラー・セマンティックカラー（`--color-primary`, `--color-surface` 等）— Radix Themes の CSS 変数（`--accent-9`, `--gray-12` 等）を参照
- **radius**: 角丸（`--radius-1` 〜 `--radius-6`）— 固定値
- **shadow**: ボックスシャドウ（`--shadow-1` 〜 `--shadow-6`）— 固定値

### color トークンと Radix Themes の関係

color トークンは Radix Themes のカラーシステム（`--accent-*`, `--gray-*` 等）に委譲している。これにより Radix コンポーネントと自前 CSS の色が自動的に揃う。Radix Themes から移行する際は、`tokens.css` の color トークンの値を固定値に差し替える。

## 4. 剥がしやすさの設計

トークン（CSS 変数）を安定層とし、コンポーネントライブラリは差し替え可能な層として扱う。

### 将来の移行パス

1. **現在**: Radix Themes + CSS Modules（トークン共有）
2. **中期**: Radix Primitives + CSS Modules（見た目を完全に自前で制御、振る舞いだけライブラリに委譲）
3. **長期**: 完全自前（必要に応じて）

どの段階でもトークン（`tokens.css`）のインターフェース（変数名）はそのまま使い続けられる。移行時に color トークンの値を Radix 変数参照から固定値に差し替えるだけで、自前 CSS Modules 側の変更は不要。

## 5. 採用しない方針

- **Tailwind CSS**: 独自記法への依存が大きく、CSS Modules と役割が競合する
- **CSS-in-JS ランタイム系**（Emotion, styled-components）: ランタイムコスト、Server Components との相性の悪さ
- **Radix Themes の Layout コンポーネント**（Text, Flex, Box 等）: HTML の意味が薄れ、CSS Modules で十分に表現できるレイアウトまでライブラリに依存する必要がない
