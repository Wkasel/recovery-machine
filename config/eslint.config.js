import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";
import playwrightPlugin from "eslint-plugin-playwright";
import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

const tsConfigs = ["./tsconfig.json"];

/** @type {Array<import('eslint').Linter.FlatConfig>} */
export default [
  // Global settings
  {
    ignores: [
      "*.js",
      "*.mjs",
      "*.cjs",
      "*.json",
      ".next/**",
      "config/tailwind.config.ts",
      "components.json",
      "next.config.ts",
      "package.json",
      "tsconfig.json",
      "public/*",
      "config/next-sitemap.config.js",
      "config/postcss.config.js",
      "config/tailwind.config.js",
      "config/eslint.config.js",
    ],
  },

  // Base configs
  js.configs.recommended,
  prettier,

  // TypeScript + Next.js source files
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: tsConfigs,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        JSX: "readonly",
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-head-element": "error",
      "@next/next/no-unwanted-polyfillio": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-title-in-document-head": "error",
      "@next/next/no-script-component-in-head": "error",
      "@next/next/no-duplicate-head": "error",
      "@next/next/google-font-display": "error",
      "@next/next/google-font-preconnect": "error",
      "@next/next/next-script-for-ga": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-css-tags": "error",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          printWidth: 100,
          trailingComma: "es5",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": [
        "error",
        {
          allowSingleExtends: true,
        },
      ],
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },

  // E2E test files
  {
    files: ["e2e/**/*.spec.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      playwright: playwrightPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: tsConfigs,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...playwrightPlugin.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          printWidth: 100,
          trailingComma: "es5",
        },
      ],
    },
  },

  // JavaScript files (like debug-init.js)
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
