import { Preview } from '@storybook/react';
import DocumentationTemplate from './templates/documentation-template.mdx';
import { decorator as reportDecorator, loader as reportLoader } from './components/report-badge';
import { decorator as themeDecorator } from './components/switch-theme';
import theme from './theme';
import '../dist/theme/minimal.css';
import './styles.scss';

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    reportDecorator,
    themeDecorator,
  ],
  loaders: [
    reportLoader,
  ],
  parameters: {
    layout: 'none',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#151515' },
        { name: 'light', value: '#F7F9F2' },
      ],
    },
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
};

export default preview;
