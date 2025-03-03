import { Preview } from '@storybook/react';
import DocumentationTemplate from './templates/documentation-template.mdx';
import { decorator as reportDecorator, loader as reportLoader } from './components/report-badge';
import { decorator as addonThemeDecorator } from './addons';
import theme from './theme';
import '../src/themes/minimal.scss';
import './styles.scss';

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    reportDecorator,
    addonThemeDecorator,
  ],
  loaders: [
    reportLoader,
  ],
  parameters: {
    layout: 'fullscreen',
    disableSaveFromUI: true,
    isDarkMode: [
      { name: 'dark', value: '#151515' },
      { name: 'light', value: '#F7F9F2' },
    ],
    controls: {
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Get Started', '*'],
      },
    },
    docs: {
      theme,
      page: DocumentationTemplate,
    },
  },
  globalTypes: {
    isDarkMode: {
      type: 'boolean',
    },
  },
  initialGlobals: {
    isDarkMode: true,
  }
};

export default preview;
