import { describe, it, expect } from 'vitest';
import { url } from '../../src';

describe('validators/url.ts', () => {
  describe('#url', () => {
    const url0 = 'http://aaa.com';
    const url1 = 'https://aaa.com';
    const url2 = 'file://aaa.exe';
    const url3 = 'ftp://aaa.com';
    const url4 = 'https://subdomain.domain.com/path/to/api?serarch=aaa#hash';
    const invalid0 = 'aaa.com';
    const invalid1 = 'file://aaa.com';
    const invalid2 = '-http://aaa.com///';
    const invalid3 = 'z@bcc';

    it('validate url', () => {
      const validator = url('error_message');

      expect(validator(url0, {})).toStrictEqual(true);
      expect(validator(url1, {})).toStrictEqual(true);
      expect(validator(url2, {})).toStrictEqual(true);
      expect(validator(url3, {})).toStrictEqual(true);
      expect(validator(url4, {})).toStrictEqual(true);
    });

    it('invalid url', () => {
      const validator = url('error_message');
      const validatorHttp = url('error_message', true);

      expect(validator(invalid0, {})).toStrictEqual('error_message');
      expect(validatorHttp(invalid1, {})).toStrictEqual('error_message');
      expect(validator(invalid2, {})).toStrictEqual('error_message');
      expect(validator(invalid3, {})).toStrictEqual('error_message');
    });

    it('empty value shouldn\'t invalid', () => {
      const validator = url('error_message');

      expect(validator('', {})).toStrictEqual(true);
    });
  })
});