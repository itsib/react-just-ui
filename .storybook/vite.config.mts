import { defineConfig, UserConfig } from 'vite';
import postcssVariables from 'postcss-advanced-variables';
import { ThemeConfig } from '../theme.config';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  return {
    mode,
    server: {
      open: false,
    },
    publicDir: './storybook/public',
    css: {
      modules: {},
      postcss: {
        plugins: [
          postcssVariables({
            variables(name: string) {
              const fields = name.split('-');
              let value: any = ThemeConfig.minimal;

              for (const field of fields) {
                if (field && value && field in value) {
                  value = value[field];
                } else {
                  break;
                }
              }
              if (typeof value === 'object' || value == null) {
                return 'none';
              } else if (typeof value === 'number') {
                return `${value}px`;
              } else {
                return value;
              }
            },
            unresolved: 'warn',
          }),
          postcssImport(),
          autoprefixer(),
          postcssNesting(),
        ],
      },
    },

  }
});