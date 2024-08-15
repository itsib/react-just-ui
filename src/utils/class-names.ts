/**
 * Implementation of the cn function
 *
 * @param objs - Class Names
 *
 * @internal
 */
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

/**
 * A function for managing class names in React.
 *
 * @param objs - The list of classes can be a string,
 * an array of strings and an object where
 * the keys are class names and the value is to enable or
 * disable this name in the list of classes.
 *
 * @example
 * ```tsx
 * <div
 *   classNames={
 *     cn(
 *       'string-class',
 *       ['array-classes'],
 *       {
 *         'enabled-classname': true,
 *         'disabled-classname': false,
 *       }
 *     )
 *   }
 * />
 * ```
 *
 * @public
 */
export const cn = classNames;