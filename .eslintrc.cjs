module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'plugin:storybook/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config.*'],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-async-promise-executor': 'off',
  },
}
