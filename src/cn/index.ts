/**
 * A function for managing class names in React.
 *
 * @param args - The list of classes can be a string,
 * an array of strings and an object where
 * the keys are class names and the value is to enable or
 * disable this name in the list of classes.
 *
 * @example
 * ```typescript
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
export function cn(...args: (any | Record<string, boolean> | any[] | null | undefined)[]): string {
  let output = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg || typeof arg === 'function') continue;

    if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'symbol') {
      output += ` ${arg.toString()}`
    } else if (arg && typeof arg === 'object') {
      if (Array.isArray(arg)) {
        for (let j = 0; j < arg.length; j++) {
          if (arg[j]) {
            output += ` ${arg[j]}`;
          }
        }
      } else {
        const classNames = Object.keys(arg);
        for (let j = 0; j < classNames.length; j++) {
          if (arg[classNames[j]]) {
            output += ` ${classNames[j]}`;
          }
        }
      }
    }
  }
  return output.trim();
}