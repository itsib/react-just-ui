import { ValidationFn } from '../types';

export function merge(validators: ValidationFn[]): ValidationFn {
  return (value: any, values: any) => {
    for (let i = 0; i < validators.length; i++) {
      const result = validators[i](value, values);
      if (result) {
        continue;
      }
      return result;
    }
    return true;
  }
}