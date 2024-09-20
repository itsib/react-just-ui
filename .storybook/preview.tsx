import type { Preview } from '@storybook/react';
import { Controls, Description, Primary, Subtitle, Title } from '@storybook/blocks';
import '../src/css/minimal.css';
import './styles.css';
import { themeDark } from './theme';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

export default preview;
