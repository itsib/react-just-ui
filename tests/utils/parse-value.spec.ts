import { describe, it, expect } from 'vitest';
import { parseValue, parseValues } from '../../src/utils/parse-value';

describe('utils/parse-value.ts', () => {

  describe('#parseValue', () => {
    it('Should parse value', () => {
      expect(parseValue('10', 0, 100, 1)).toStrictEqual(10);
      expect(parseValue('10.2', 0, 100, 1)).toStrictEqual(10);
      expect(parseValue('10.8', 0, 100, 1)).toStrictEqual(11);
      expect(parseValue('9.51', 0, 100, 1)).toStrictEqual(10);
      expect(parseValue('9.5', 0, 100, 1)).toStrictEqual(9);
    });

    it('Should throw if min greater than max', () => {
      expect(() => parseValue('10', 100, 10, 1)).toThrow('MIN_MAX');
    });

    it('Should been min if unparsed', () => {
      expect(parseValue('', 10, 100, 1)).toStrictEqual(10);
      expect(parseValue('asd', 10, 100, 1)).toStrictEqual(10);
      expect(parseValue('a234sd', 10, 100, 1)).toStrictEqual(10);
    });

    it('Should gte min', () => {
      expect(parseValue('9', 10, 100, 1)).toStrictEqual(10);
      expect(parseValue('9.99999', 10, 100, 1)).toStrictEqual(10);
      expect(parseValue('10', 10, 100, 1)).toStrictEqual(10);
      expect(parseValue('10.000001', 10, 100, 1)).toStrictEqual(10);
      expect(parseValue('-100.000001', -100, 100, 1)).toStrictEqual(-100);
    });

    it('Should lte max', () => {
      expect(parseValue('101', 10, 100, 1)).toStrictEqual(100);
      expect(parseValue('100.000001', 10, 100, 1)).toStrictEqual(100);
      expect(parseValue('99', 10, 100, 1)).toStrictEqual(99);
      expect(parseValue('99', -200, -100, 1)).toStrictEqual(-100);
    });

    it('Should clamp value', () => {
      expect(parseValue('0', 0, 100, 10)).toStrictEqual(0);
      expect(parseValue('5', 0, 100, 10)).toStrictEqual(0);
      expect(parseValue('5.1', 0, 100, 10)).toStrictEqual(10);

      expect(parseValue('10', 0, 100, 50)).toStrictEqual(0);
      expect(parseValue('40', 0, 100, 50)).toStrictEqual(50);
      expect(parseValue('60', 0, 100, 50)).toStrictEqual(50);
      expect(parseValue('76', 0, 100, 50)).toStrictEqual(100);

      expect(parseValue('29', 0, 100, 60)).toStrictEqual(0);
      expect(parseValue('76', 0, 100, 60)).toStrictEqual(60);
      expect(parseValue('100', 0, 100, 60)).toStrictEqual(60);
      expect(parseValue('200', 0, 100, 60)).toStrictEqual(60);

      expect(parseValue('23.98465', 0, 100, 0.01)).toStrictEqual(23.98);
      expect(parseValue('23.36465', 0, 100, 0.05)).toStrictEqual(23.35);
      expect(parseValue('23.195', 0, 100, 0.1)).toStrictEqual(23.2);
    });
  });

  describe('#parseValues', () => {
    it('Should parse simple value', () => {
      expect(parseValues('10', 0, 100, 1)).toStrictEqual([0, 10]);
      expect(parseValues('10.2', 0, 100, 1)).toStrictEqual([0, 10]);
      expect(parseValues('10.8', 0, 100, 1)).toStrictEqual([0, 11]);
      expect(parseValues('9.51', 0, 100, 1)).toStrictEqual([0, 10]);
    });

    it('Should return min value as default', () => {
      expect(parseValues('', 0, 100, 1)).toStrictEqual([0, 0]);
      expect(parseValues('qweqwe', 0, 100, 1)).toStrictEqual([0, 0]);
      expect(parseValues('qw231we', 0, 100, 1)).toStrictEqual([0, 0]);
    });

    it('Should parse dual value', () => {
      expect(parseValues('10:21', 0, 100, 1)).toStrictEqual([10, 21]);
      expect(parseValues('23.195:101', 0, 100, 0.1)).toStrictEqual([23.2, 100]);
    });
  });
});