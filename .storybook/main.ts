import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
    enableCrashReports: false,
    crossOriginIsolated: true,
  },
  features: {
    backgroundsStoryGlobals: false,
    viewportStoryGlobals: false,
  },
  // refs: {
  //   'react-just-ui': {
  //     title: 'Just UI - components library for react',
  //     url: 'https://github.com/itsib/react-just-ui',
  //   },
  // },
  stories: [
    './stories/get-started.mdx',
    './stories/**/*.mdx',
    './stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: './.storybook/vite.config.mts',
      },
    },
  },
  staticDirs: ['./public/'],
  docs: {
    defaultName: 'Overview',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: true,
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => {
        if (prop.name === 'id') {
          prop.required = true;
          return true;
        }
        if (prop.name === 'ref') {
          prop.type = {name: 'React.Ref<HTMLInputElement> | null'};
          return true;
        }
        return prop.parent ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName) : true;
      },
      shouldRemoveUndefinedFromOptional: true,
    },
  },
};

export default config;
