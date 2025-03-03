import { describe, it, expect } from 'vitest';
import { cn } from '../../src';

describe('utils/cn.ts', () => {
  describe('#cn', () => {
    it ('strings', () => {
      expect(cn('')).toStrictEqual('');
      expect(cn('foo')).toStrictEqual('foo');
      expect(cn(true && 'foo')).toStrictEqual('foo');
      expect(cn(false && 'foo')).toStrictEqual('');
    });

    it('strings (variadic)', () => {
      expect(cn('')).toStrictEqual('');
      expect(cn('foo', 'bar')).toStrictEqual('foo bar');
      expect(cn(true && 'foo', false && 'bar', 'baz')).toStrictEqual('foo baz');
      expect(cn(false && 'foo', 'bar', 'baz', '')).toStrictEqual('bar baz');
    });

    it('numbers', () => {
      expect(cn(1)).toStrictEqual('1');
      expect(cn(12)).toStrictEqual('12');
      expect(cn(0.1)).toStrictEqual('0.1');
      expect(cn(0)).toStrictEqual('');

      expect(cn(Infinity)).toStrictEqual('Infinity');
      expect(cn(NaN)).toStrictEqual('');
    });

    it('numbers (variadic)', () => {
      expect(cn(0, 1)).toStrictEqual('1');
      expect(cn(1, 2)).toStrictEqual('1 2');
    });

    it('objects', () => {
      expect(cn({})).toStrictEqual('');
      expect(cn({ foo:true })).toStrictEqual('foo');
      expect(cn({ foo:true, bar:false })).toStrictEqual('foo');
      expect(cn({ foo:'hiya', bar:1 })).toStrictEqual('foo bar');
      expect(cn({ foo:1, bar:0, baz:1 })).toStrictEqual('foo baz');
      expect(cn({ '-foo':1, '--bar':1 })).toStrictEqual('-foo --bar');
    });

    it('objects (variadic)', () => {
      expect(cn({}, {})).toStrictEqual('');
      expect(cn({ foo:1 }, { bar:2 })).toStrictEqual('foo bar');
      expect(cn({ foo:1 }, null, { baz:1, bat:0 })).toStrictEqual('foo baz');
      expect(cn({ foo:1 }, {}, {}, { bar:'a' }, { baz:null, bat:Infinity })).toStrictEqual('foo bar bat');
    });

    it('arrays', () => {
      expect(cn([])).toStrictEqual('');
      expect(cn(['foo'])).toStrictEqual('foo');
      expect(cn(['foo', 'bar'])).toStrictEqual('foo bar');
      expect(cn(['foo', 0 && 'bar', 1 && 'baz'])).toStrictEqual('foo baz');
    });

    it('arrays (variadic)', () => {
      expect(cn([], [])).toStrictEqual('');
      expect(cn(['foo'], ['bar'])).toStrictEqual('foo bar');
      expect(cn(['foo'], null, ['baz', ''], true, '', [])).toStrictEqual('foo baz');
    });

    it('arrays (no `push` escape)', () => {
      expect(cn({ push:1 })).toStrictEqual('push');
      expect(cn({ pop:true })).toStrictEqual('pop');
      expect(cn({ push:true })).toStrictEqual('push');
      expect(cn('hello', { world:1, push:true })).toStrictEqual('hello world push');
    });
  });
});