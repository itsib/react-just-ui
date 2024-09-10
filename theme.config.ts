export const ThemeConfig = {
  minimal: {
    color: {
      black: '0 0 0',
      white: '255 255 255',
      accent: { light: '0 115 229', dark: '0 115 229' },
      error: { light: '220 38 38', dark: '240 28 28' }
    },
    font: {
      md: '1rem',
      sm: '0.875rem',
      xs: '0.75rem',
    },
    control: {
      height: 40,
      margin: { top: 4, bottom: 2 },
      padding: { x: '0.75rem', y: '0.25rem' },
      border: { radius: 6, width: 1 },
      font: { size: '1rem' },
      label: { size: '0.875rem' },
      error: { size: '0.75rem', height: 'calc(0.75rem + 4px)' },
    },
    checkbox: {
      size: 20,
      animation: { in: '.4s', out: '.2s', ease: 'cubic-bezier(.4,.0,.23,1)' },
    },
    scroll: {
      width: 4,
      padding: { x: 0, y: 4 },
    },
    radio: { size: 18 },
    switch: { width: 46 },

  },
}