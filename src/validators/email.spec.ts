import { describe, it, expect } from 'vitest';
import { email } from './email';

describe('validators/email.ts', () => {
  describe('#email', () => {
    const email0 = 'example@mail.com';
    const email1 = 'a@b.cc';
    const invalid0 = 'a@b.';
    const invalid1 = '@b.cc';
    const invalid2 = 'q|b.cc';
    const invalid3 = 'z@bcc';

    it('validate email', () => {
      const validator = email('error_message');

      expect(validator(email0, {})).toStrictEqual(true);
      expect(validator(email1, {})).toStrictEqual(true);
    });

    it('invalid email', () => {
      const validator = email('error_message');

      expect(validator(invalid0, {})).toStrictEqual('error_message');
      expect(validator(invalid1, {})).toStrictEqual('error_message');
      expect(validator(invalid2, {})).toStrictEqual('error_message');
      expect(validator(invalid3, {})).toStrictEqual('error_message');
    });

    it('empty value shouldn\'t invalid', () => {
      const validator = email('error_message');

      expect(validator('', {})).toStrictEqual(true);
    });
  })
});