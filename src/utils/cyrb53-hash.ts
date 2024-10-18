import type { Hash } from '../types';

/**
 * CYRB53 is a simple and fast hashing algorithm.
 * But it is not secure, it is not recommended to use
 * it for hashing passwords. The algorithm is
 * suitable for generating an ID based on any known data.
 *
 * @example
 *
 * ```typescript
 * const username = "Jack Daniel's"
 * const dateOfBirth = "05.09.1846"
 *
 * const id = cyrb53Hash(username + ":" + dateOfBirth);
 * ```
 *
 * @param str - The string from which the hash will be calculated.
 * @param seed - Salt, an additional number that adds uniqueness. You can use a random number.
 */
export function cyrb53Hash(str: string, seed = 0): Hash {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `0x${(4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16)}`;
}