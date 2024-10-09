import { cn } from '../utils';

/**
 * Generates a set of classes for binary form input controls.
 *
 * @param {'checkbox'|'radio'|'switch'|string} type
 * @param className
 * @param disabled
 * @param rowReverse
 */
export function switchCN(type: string, className?: string, disabled?: boolean, rowReverse?: boolean): string {
  return cn(`__prefix__ __prefix__-${type}`, className, {
    row: !rowReverse,
    'row-reverse': !!rowReverse,
    disabled: !!disabled,
  });
}

/**
 * Class name builder for inputs
 * @param type
 * @param className
 * @param loading
 * @param disabled
 * @param error
 */
export function inputCN(type: string, className?: string, loading?: boolean, disabled?: boolean, error?: any): string {
  return cn(`${PREFIX} ${PREFIX}-${type}`, className, {
    loading: !!loading,
    error: !!error,
    disabled: !!disabled,
  });
}

/**
 * Add lib prefix to class name
 * @param rest
 */
export function prefixedCN(...rest: (string | boolean)[]): string {
  if (rest.length === 0) {
    return '';
  }
  const highPriority = typeof rest[rest.length - 1] === 'boolean' ? rest.pop() : false;
  const classNames = rest.map(className => `${PREFIX}-${className}`).join(' ');

  if (highPriority) {
    return `${PREFIX} ${classNames}`;
  } else {
    return classNames;
  }
}