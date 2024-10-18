import { describe, expect, it } from 'vitest';
import { cyrb53Hash } from './cyrb53-hash';

describe('utils/hash-cyrb53.ts', () => {
  describe('#cyrb53Hash', () => {
    it('hash should same', () => {
      const hashA = cyrb53Hash('string:11111', 1);
      const hashB = cyrb53Hash('string:11111', 1);
      expect(hashA).toStrictEqual(hashB);
    });

    it('different salt', () => {
      const hashA = cyrb53Hash('string:11111', 2);
      const hashB = cyrb53Hash('string:11111', 1);
      expect(hashA).not.toStrictEqual(hashB);
    });

    it('check hash', () => {
      const hash1 = cyrb53Hash('1');
      const hash2 = cyrb53Hash('2');
      expect(hash1).toStrictEqual('0x546d8e4fa6648');
      expect(hash2).toStrictEqual('0xc6d5b50db4c54');
    });
  });
});