// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    /**
     * config with just ignores is the replacement for `.eslintignore`
     * @see https://typescript-eslint.io/packages/typescript-eslint#advanced-usage
     * */
    ignores: ["utils/", "ignore-*", "eslint.config.mjs", "playwright-report/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // define TS project config to enable "linting with type information"
    languageOptions: {
      parserOptions: {
        // reuse the existing `tsconfig.json`
        project: true,
        tsconfigRootDir: ".",
      },
    },
    // enable linting rules beneficial for Playwright projects
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
    },
  }
);
