
export function classNames(obj: string | Record<string, boolean> | string[], ...classNames: (string | null | undefined)[]): string {
  let output = '';
  if (typeof obj === 'string') {
    output += ` ${obj}`
  } else if (Array.isArray(obj)) {
    output += ` ${obj.filter(Boolean).join(' ')}`;
  } else if (typeof obj === 'object') {
    const classes = Object.keys(obj);

    output += ` ${classes.filter(cssClass => obj[cssClass]).join(' ')}`;
  }

  output += ` ${classNames.filter(Boolean).join(' ')}`;

  return output.trim();
}

export const cn = classNames;