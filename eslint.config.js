import js from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y-x";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "coverage/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  sonarjs.configs.recommended,
  {
    files: ["src/**/*.tsx"],
    plugins: jsxA11y.configs.strict.plugins,
    rules: {
      ...jsxA11y.configs.strict.rules,
      "jsx-a11y-x/prefer-tag-over-role": "error",
    },
  },
  { files: ["src/**/*.{ts,tsx}"], languageOptions: { globals: globals.browser } },
  { files: ["scripts/**/*.mjs"], languageOptions: { globals: globals.node } },
  {
    files: ["src/features/backlog/infrastructure/migration.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/no-duplicate-string": ["error", { threshold: 4 }],
      "sonarjs/no-nested-conditional": "error",
      "sonarjs/no-nested-functions": "off",
      "sonarjs/todo-tag": "off",
    },
  }
);
