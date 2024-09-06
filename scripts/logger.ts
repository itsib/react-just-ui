declare global {
  export interface String {
    render: () => void;
  }
}

(String.prototype as any).render = function (this: string) {
  console.log(this);
}

export function log(message: string, color?: string, bright = false, mod = 0): string {
  const prefix = `\x1b[${mod};${bright ? 9 : 3}`

  let code = '';
  switch (color) {
    case 'black':
      code = prefix + '0m';
      break;
    case 'red':
      code = prefix + '1m';
      break;
    case 'green':
      code = prefix + '2m';
      break;
    case 'yellow':
      code = prefix + '3m';
      break;
    case 'blue':
      code = prefix + '4m';
      break;
    case 'magenta':
      code = prefix + '5m';
      break;
    case 'cyan':
      code = prefix + '6m';
      break;
    case 'gray':
      code = prefix + '7m';
      break;
  }
  return `${code}${message}\x1b[0m`;
}

const FRAMES = ['⢰', '⣠', '⣄', '⡆', '⠇', '⠋', '⠙', '⠸'];
let current = 0;
function getFrame(): string {
  current = current + 1;
  if (current > (FRAMES.length - 1)) {
    current = 0;
  }
  return FRAMES[current]
}

function clear() {
  process.stdout.write('\x1Bc');
}




export function loading(title: string) {
  let timer: any;

  const render = () => {
    process.stdout.cursorTo(0);
    process.stdout.write(`\x1b[0;96m${getFrame()}\x1b[0m ${title}`);

    timer = setTimeout(render, 100);
  };

  render();

  return (result?: string) => {
    clearTimeout(timer);
    process.stdout.cursorTo(0);
    process.stdout.write(' '.repeat(title.length + 10));
    process.stdout.cursorTo(0);

    console.log(result);
  }
}