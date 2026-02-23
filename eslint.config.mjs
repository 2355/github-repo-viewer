import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import reactCompiler from "eslint-plugin-react-compiler";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // typescript-eslint の recommended (nextTs に含まれる) より厳格なルールセット。
  // no-floating-promises, no-misused-promises 等の型情報ベースのルールが追加される。
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // strictTypeChecked の型情報ベースルールに必要
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // number と boolean はテンプレートリテラルへの埋め込みを許可
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: true },
      ],
    },
  },

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      "react-compiler": reactCompiler,
    },
    rules: {
      // import 文を自動ソートする。named import 内の順序も含めて --fix で完全に自動修正される。
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // simple-import-sort とカバー範囲が重複するため無効化
      "import/order": "off",

      // 未使用 import を --fix で自動削除する。
      // @typescript-eslint/no-unused-vars は未使用 import も報告するが auto-fix 非対応。
      "unused-imports/no-unused-imports": "error",

      // React Compiler の最適化を阻害するコードパターンを検出する
      "react-compiler/react-compiler": "error",
    },
  },

  // tsconfig.json に含まれない設定ファイルでは型チェックルールを無効化
  {
    files: ["eslint.config.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  // Next.js の redirects 等は API 仕様上 async が必要だが await は不要
  {
    files: ["next.config.ts"],
    rules: {
      "@typescript-eslint/require-await": "off",
    },
  },

  // Prettier と競合するフォーマット系ルールを無効化。必ず最後に配置する。
  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
