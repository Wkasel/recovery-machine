import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import playwrightPlugin from "eslint-plugin-playwright";
import prettierPlugin from "eslint-plugin-prettier";
import fs from "fs";
import globals from "globals";
import path from "path";

const tsConfigs = ["./tsconfig.json"];

const MAX_FILE_LINES = 300; // Reasonable limit for file length

// Custom rules to enforce our patterns
const customRules = {
  "no-direct-supabase": {
    create(context) {
      const filename = context.getFilename();
      const allowedPaths = [
        "core/supabase",
        "core/services/auth/hooks",
        "core/services/supabase",
      ];

      const isAllowedPath = allowedPaths.some(path => filename.includes(path));
      const isServerFile = filename.includes("server") || filename.includes("actions");

      return {
        ImportDeclaration(node) {
          if (
            node.source.value === "@supabase/supabase-js" &&
            !isAllowedPath &&
            isServerFile
          ) {
            context.report({
              node,
              message:
                "Direct Supabase imports in server files are not allowed. Use server actions from core/actions/server instead.",
            });
          }
        },
        MemberExpression(node) {
          if (
            node.object.name === "supabase" &&
            !isAllowedPath &&
            isServerFile
          ) {
            context.report({
              node,
              message:
                "Direct Supabase usage in server files is not allowed. Use server actions from core/actions/server instead.",
            });
          }
        },
      };
    },
  },
  "enforce-auth-patterns": {
    create(context) {
      return {
        CallExpression(node) {
          // Check for direct auth calls
          if (
            node.callee.property &&
            ["signIn", "signUp", "signOut"].includes(node.callee.property.name) &&
            !context.getFilename().includes("core/actions/server/auth")
          ) {
            context.report({
              node,
              message:
                "Direct auth method calls are not allowed. Use auth actions from core/actions/server/auth instead.",
            });
          }
        },
        // Ensure AuthProvider is used correctly
        JSXElement(node) {
          if (
            node.openingElement.name.name === "AuthProvider" &&
            !node.openingElement.attributes.some(
              (attr) => attr.name.name === "availableMethods" || attr.name.name === "redirectTo"
            )
          ) {
            context.report({
              node,
              message: "AuthProvider must specify availableMethods and redirectTo props.",
            });
          }
        },
      };
    },
  },
  "enforce-module-organization": {
    create(context) {
      const filename = context.getFilename();
      const sourceCode = context.getSourceCode();
      const lines = sourceCode.lines.length;

      return {
        Program(node) {
          // Check file length
          if (lines > MAX_FILE_LINES && !filename.includes("index.ts")) {
            context.report({
              node,
              message: `File has ${lines} lines, which exceeds the maximum of ${MAX_FILE_LINES} lines. Consider breaking this file into smaller modules with a barrel export in an index.ts file.`,
            });
          }

          // Check if large files have barrel exports
          if (lines > MAX_FILE_LINES && !filename.endsWith("index.ts")) {
            const dirPath = path.dirname(filename);
            const hasBarrelFile = fs.existsSync(path.join(dirPath, "index.ts"));
            if (!hasBarrelFile) {
              context.report({
                node,
                message:
                  "Large modules should be organized with a barrel export pattern using index.ts",
              });
            }
          }

          // Enforce index.ts for directories with multiple exports
          if (filename.endsWith("index.ts")) {
            const exports = node.body.filter(
              (n) =>
                n.type === "ExportNamedDeclaration" ||
                n.type === "ExportDefaultDeclaration" ||
                n.type === "ExportAllDeclaration" // Add support for export *
            );
            if (exports.length === 0) {
              context.report({
                node,
                message: "Barrel files (index.ts) should export at least one member",
              });
            }
          }
        },
      };
    },
  },
};

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
      "node_modules/**",
      "build/**",
      "dist/**",
      "coverage/**",
      ".vercel/**",
      ".husky/**",
      ".vscode/**",
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
      "custom-rules": {
        rules: customRules,
      },
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
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
      ],
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/promise-function-async": "error",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          printWidth: 100,
          trailingComma: "es5",
          plugins: ["prettier-plugin-organize-imports"],
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
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": [
        "error",
        {
          allowSingleExtends: true,
        },
      ],
      // Custom rules to enforce our patterns
      "custom-rules/no-direct-supabase": "error",
      "custom-rules/enforce-auth-patterns": "error",
      "custom-rules/enforce-module-organization": "error",

      // File organization rules
      "max-lines": [
        "error",
        {
          max: MAX_FILE_LINES,
          skipBlankLines: true,
          skipComments: true,
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
