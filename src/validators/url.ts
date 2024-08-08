import { ValidationFn } from '../types';

/**
 * Email should contain "@" and "."
 * @param error
 */
export function url(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;
    return /^https?:\/\//.test(value) ? true : error;
  }
}