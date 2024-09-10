import { map_palette, furthest, diff, RGBColor, palette_map_key, rgb_to_lab, closest } from 'color-diff';

const theme = {
  light: {
    main: '#2E3338'
  },
  dark: {
    main: '#000'
  },
};

const text = '#ddd';
const textLight = '#fff';
const textDark = '#888';
const textDisabled = '#777';
const primary = '#08c';
const info = '#FFD166';
const success = '#06D6A0';
const error = '#EF476F';
const warn = '#E55934';
const main = '#1e1e1e';
const background = '#1e1e1e';
const foreground = '#ffffff';
const cursor = '#98989d';
const selection = '#3f638b';
const cursorAccent = '#1e1e1e';
const black = '#1a1a1a';
const red = '#cc372e';
const green = '#26a439';
const yellow = '#cdac08';
const blue = '#0869cb';
const magenta = '#9647bf';
const cyan = '#479ec2';
const white = '#98989d';
const brightBlack = '#464646';
const brightRed = '#ff453a';
const brightGreen = '#32d74b';
const brightYellow = '#ffd60a';
const brightBlue = '#0a84ff';
const brightMagenta = '#bf5af2';
const brightCyan = '#76d6ff';
const brightWhite = '#ffffff';

export function hexToRgb(hex: string): RGBColor {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);

    // 6 digits
  } else if (hex.length == 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  return { R: r, G: g, B: b, A: 1 };
}


const color = hexToRgb(primary);
// black, white
const palette = [
  {R: 0, G: 0, B: 0 },
  {R: 255, G: 255, B: 255 },
];

console.log('%o', palette_map_key(color).replace(/,/g, ''))
