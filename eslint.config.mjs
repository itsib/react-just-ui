import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslint from '@eslint/js';
import react from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  {
    name: "global-ignores",
    ignores: [
      "dist/**",
      ".storybook/**",
      "storybook-static/**",
      "plugins/**",
      "templates/**",
      "tests/bench/**",
      "tests/fixtures/**",
      "tests/performance/**",
      "tmp/**",
      "**/test.js",
      "**/*.spec.*",
      ".vscode",
      ".git",
      ".idea",
      ".browserslistrc",
      "vite.config.*"
    ]
  },
  {
    name: "tslint",
    files: [
      "src/**/*.ts",
      "src/**/*.tsx",
    ],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      eslint.configs.recommended,
      react.configs.flat.recommended,
    ],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.eslint.json',
        ecmaFeatures: {
          jsx: true,
        }
      },

      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/prefer-function-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn',  {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      'no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
    }
  },
);
