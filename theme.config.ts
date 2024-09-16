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
    tooltip: {
      margin: 2,
      padding: { x: 10, y: 8 },
      arrow: 6,
      border: { radius: 6 },
      delay: { show: '.4s', hide: '0s' },
      animation: { duration: '.2s' },
      font: { size: 12 },
    },
    scroll: {
      width: 4,
      padding: { x: 0, y: 4 },
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
    radio: { size: 18 },
    switch: { width: 46 },
    loading: {
      size: 40,
      svg: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='4' cy='12' r='0' fill='%23000'%3E%3Canimate fill='freeze' attributeName='r' begin='0;a.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='0;3'/%3E%3Canimate fill='freeze' attributeName='cx' begin='b.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='4;12'/%3E%3Canimate fill='freeze' attributeName='cx' begin='c.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='12;20'/%3E%3Canimate id='e' fill='freeze' attributeName='r' begin='d.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='3;0'/%3E%3Canimate id='a' fill='freeze' attributeName='cx' begin='e.end' dur='0.001s' values='20;4'/%3E%3C/circle%3E%3Ccircle cx='4' cy='12' r='3' fill='%23000'%3E%3Canimate fill='freeze' attributeName='cx' begin='0;a.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='4;12'/%3E%3Canimate fill='freeze' attributeName='cx' begin='b.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='12;20'/%3E%3Canimate id='f' fill='freeze' attributeName='r' begin='c.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='3;0'/%3E%3Canimate id='d' fill='freeze' attributeName='cx' begin='f.end' dur='0.001s' values='20;4'/%3E%3Canimate fill='freeze' attributeName='r' begin='d.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='0;3'/%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='3' fill='%23000'%3E%3Canimate fill='freeze' attributeName='cx' begin='0;a.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='12;20'/%3E%3Canimate id='g' fill='freeze' attributeName='r' begin='b.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='3;0'/%3E%3Canimate id='c' fill='freeze' attributeName='cx' begin='g.end' dur='0.001s' values='20;4'/%3E%3Canimate fill='freeze' attributeName='r' begin='c.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='0;3'/%3E%3Canimate fill='freeze' attributeName='cx' begin='d.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='4;12'/%3E%3C/circle%3E%3Ccircle cx='20' cy='12' r='3' fill='%23000'%3E%3Canimate id='h' fill='freeze' attributeName='r' begin='0;a.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='3;0'/%3E%3Canimate id='b' fill='freeze' attributeName='cx' begin='h.end' dur='0.001s' values='20;4'/%3E%3Canimate fill='freeze' attributeName='r' begin='b.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='0;3'/%3E%3Canimate fill='freeze' attributeName='cx' begin='c.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='4;12'/%3E%3Canimate fill='freeze' attributeName='cx' begin='d.end' calcMode='spline' dur='0.5s' keySplines='.36,.6,.31,1' values='12;20'/%3E%3C/circle%3E%3C/svg%3E\")"
    },
    image: {
    },
  },
}