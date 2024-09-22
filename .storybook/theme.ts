import { create, background, typography, color, createGlobal } from '@storybook/theming';


const theme = createGlobal({
  background,
  typography,
  color,
})

export const themeDark = create({
  base: 'dark',
  fontBase: 'Roboto, sans-serif',
  brandTitle: 'React UI',
  brandUrl: '/',
  brandImage: '/images/brand.svg',
  brandTarget: '_self',
  gridCellSize: 10,
});
