import { insert, remove } from '../src/utils/string-utils';
import { describe, it, expect } from 'vitest';

describe('utils/string-utils.ts', () => {
  describe('#insert', () => {
    it('Insert substring to end target', () => {
      expect(insert('string1', 'string2')).toEqual('string1string2');
    });

    it('Insert substring before target', () => {
      expect(insert('string1', 'string2', 0)).toEqual('string2string1');
      expect(insert('string1', 'string2', 0, 0)).toEqual('string2string1');
    });

    it('Insert substring in to target after first letter', () => {
      expect(insert('string1', 'string2', 1, 1)).toEqual('sstring2tring1');
      expect(insert('string1', 'string2', 1)).toEqual('sstring2tring1');
    });

    it('Insert substring in to target with replace', () => {
      expect(insert('string1', 'string2', 1, 3)).toEqual('sstring2ing1');
    });
  });

  describe('#remove', () => {
    it('Remove all from 3 char', () => {
      expect(remove('1234', 3, 3)).toEqual('123');
      expect(remove('1234', 3)).toEqual('123');
    });

    it('Remove all from 0 char', () => {
      expect(remove('1234', 0)).toEqual('');
      expect(remove('1234', 0, 0)).toEqual('');
    });

    it('Remove all to 3 char', () => {
      expect(remove('1234', 0, 3)).toEqual('4');
    });

    it('Remove just 3 char', () => {
      expect(remove('12345678', 2, 3)).toEqual('1245678');
    });
  });
});