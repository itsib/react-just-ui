import { ValidationFn } from '../types';

/**
 * Email should contain "@" and "."
 * @param error
 */
export function email(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    const segments = value.split('@');
    if (segments.length === 2 && segments[1].split('.').length >= 2) {
      return true;
    }
    return error
  }
}