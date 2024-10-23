import type { ValidationFn } from '../types';

const DIGIT_REGEX = /^\d+(:?\.\d+)?$/;

export function number(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    return DIGIT_REGEX.test(value) ? true : error;
  }
}