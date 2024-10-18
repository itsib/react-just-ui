import { describe, expect, it } from 'vitest';
import { required } from './required';

describe('validators/required.ts', () => {
  describe('#required', () => {
    it('check empty/not empty string', () => {
      const validator = required('required');

      expect(validator('a', {})).toStrictEqual(true);
      expect(validator('', {})).toStrictEqual('required');
    });
  })
});