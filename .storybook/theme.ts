import { create } from '@storybook/theming';

const theme = create({
  base: 'dark',
  fontBase: 'Roboto, sans-serif',
  brandTitle: 'React UI',
  brandUrl: '/',
  brandImage: '/images/brand-dark.svg',
  brandTarget: '_self',
});

export default theme;
