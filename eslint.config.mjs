import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '.storybook',
      'temp',
      'plugins',
      'themes',
      'dist',
      'node_modules',
      'storybook-static',
      'tsconfig.declare.tsbuildinfo',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        project: ['tsconfig.eslint.json'],
        warnOnUnsupportedTypeScriptVersion: false,
        loggerFn: false,
        ecmaFeatures: {
          jsx: true,
        }
      },

      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'perfectionist': perfectionist,
    },
    files: [
      'src/**/*.ts',
      'src/**/*.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/prefer-function-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn',  {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }]
    }
  },
);
