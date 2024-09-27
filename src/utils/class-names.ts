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
export function cn(...objs: (string | Record<string, boolean> | string[] | null | undefined)[]): string {
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
  return output.trim();
}

/**
 * Generates a set of classes for binary form input controls.
 *
 * @param {'checkbox'|'radio'|'switch'|string} type
 * @param className
 * @param disabled
 * @param rowReverse
 */
export function switchCN(type: string, className?: string, disabled?: boolean, rowReverse?: boolean): string {
  return cn(`jj jj-${type}`, className, {
    row: !rowReverse,
    'row-reverse': !!rowReverse,
    disabled: !!disabled,
  });
}

export function inputCN(type: string, className?: string, loading?: boolean, disabled?: boolean, error?: any): string {
  return cn(`jj jj-${type}`, className, {
    loading: !!loading,
    error: !!error,
    disabled: !!disabled,
  });
}