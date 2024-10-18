import type { ValidationFn } from '../types';

export function required(error: any): ValidationFn {
  return (value: string) => {
    return value ? true : error;
  }
}