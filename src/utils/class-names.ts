
export function classNames(...objs: (string | Record<string, boolean> | string[] | null | undefined)[]): string {
  let output = '';

  for (let i = 0; i < objs.length; i++) {
    if (!objs[i]) continue;

    const obj = objs[i];
    if (typeof obj === 'string') {
      output += ` ${obj}`
    } else if (Array.isArray(obj)) {
      for (let j = 0; j < obj.length; j++) {
        if (obj[j]) {
          output += ` ${obj[j]}`;
        }
      }
    } else if (typeof obj === 'object') {
      for (const cssClass in obj as any) {
        if ((obj as any)[cssClass]) {
          output += ` ${cssClass}`;
        }
      }
    }
  }
  return output;
}

export const cn = classNames;