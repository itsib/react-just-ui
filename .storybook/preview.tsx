import { Preview } from '@storybook/react';
import { Controls, Description, Primary, Subtitle, Title } from '@storybook/blocks';
import { decorator as reportDecorator, loader as reportLoader } from './components/report-badge';
import { themeDark } from './theme';
import '../src/css/minimal.css';
import './styles.css';

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  decorators: [
    reportDecorator,
  ],
  loaders: [
    reportLoader,
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
        boolean: /(disabled|loading|checked|upper)$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Basic', '*'],
      },
    },
    backgrounds: {
      default: 'dark',
    },
    docs: {
      theme: themeDark,
      page: () => (
        <>
          <Title/>
          <Subtitle/>
          <Description/>
          <Primary/>
          <Controls/>
        </>
      ),
    },
  },
};

export default preview;
