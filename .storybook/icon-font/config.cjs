module.exports = {
  inputDir: './icons', // (required)
  outputDir: '../fonts/icon-font', // (required)
  fontTypes: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
  assetTypes: ['scss', 'css', 'html'],
  fontsUrl: '/fonts/icon-font',
  prefix: 'icon',
  name: 'IconFont',
  templates: {
    css: './tmpl/css.hbs',
    scss: './tmpl/scss.hbs',
    html: './tmpl/html.hbs',
  },
  pathOptions: {
    html: './demo/index.html',
    css: './demo/icons.css',
    json: './demo/icons.json',
    scss: '../fonts/icon-font/icon-font.css',
  },
  fontHeight: 512,
  round: true,
  descent: 120,
  formatOptions: {
    json: {
      indent: 2
    },
  },
};
