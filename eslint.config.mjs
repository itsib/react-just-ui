import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslint from '@eslint/js';

export default [
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  eslint.configs.recommended,
  {
    name: "global-ignores",
    ignores: [
      "dist/**",
      ".storybook/**",
      "plugins/**",
      "templates/**",
      "tests/bench/**",
      "tests/fixtures/**",
      "tests/performance/**",
      "tmp/**",
      "**/test.js",
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
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.eslint.json',
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      // 'eslint-import': eslintImport.flatConfigs.recommended
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
    }
  },
];
