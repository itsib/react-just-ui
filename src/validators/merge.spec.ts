import { describe, expect, it } from 'vitest';
import { email } from './email';
import { merge } from './merge';
import { required } from './required';

describe('validators/merge.ts', () => {
  describe('#merge', () => {
    it('combine required and email', () => {
      const validator = merge([
        required('required'),
        email('invalid_email'),
      ]);

      expect(validator('', {})).toStrictEqual('required');
      expect(validator('a', {})).toStrictEqual('invalid_email');
      expect(validator('example@mail.com', {})).toStrictEqual(true);
    });
  });
});