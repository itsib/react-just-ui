import { describe, expect, it } from 'vitest';
import { number } from '../../src';

describe('validators/number.ts', () => {
  describe('#number', () => {
    it('should valid number', () => {
      const validator = number('error_message');

      expect(validator('0', {})).toStrictEqual(true);
      expect(validator('1.0', {})).toStrictEqual(true);
      expect(validator('324.223', {})).toStrictEqual(true);
    });

    it('should invalid number', () => {
      const validator = number('error_message');

      expect(validator('.1', {})).toStrictEqual('error_message');
      expect(validator('.', {})).toStrictEqual('error_message');
      expect(validator('e', {})).toStrictEqual('error_message');
      expect(validator('1.', {})).toStrictEqual('error_message');
      expect(validator('1,6', {})).toStrictEqual('error_message');
      expect(validator('666w888', {})).toStrictEqual('error_message');
    });

    it('empty value shouldn\'t invalid', () => {
      const validator = number('error_message');

      expect(validator('', {})).toStrictEqual(true);
    });
  })
});