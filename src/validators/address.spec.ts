import { describe, it, expect } from 'vitest';
import { btcAddress, ethAddress } from './address';

describe('validators/address.ts', () => {
  describe('#btcAddress', () => {
    const mainnetAddress = '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem';
    const testnetAddress = 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn';
    const invalidAddress = '17VZNX1SN5NtKO8UQFxwQbFeFc3iqRYhem';

    it('validates Mainnet', () => {
      const validator = btcAddress('error_message');

      expect(validator(mainnetAddress, {})).toBeTruthy();
      expect(validator(testnetAddress, {})).toEqual('error_message');
    });

    it('validates Testnet', () => {
      const validator = btcAddress('error_message', true);

      expect(validator(testnetAddress, {})).toBeTruthy();
      expect(validator(mainnetAddress, {})).toEqual('error_message');
    });

    it('fails check error message', () => {
      const validator = btcAddress('error_message');

      expect(validator(invalidAddress, {})).toEqual('error_message');
    });
  })

  describe('#ethAddress', () => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const ethereumAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

    it('validate ETH & zero addresses', () => {
      const validator = ethAddress('error_message');

      expect(validator(zeroAddress, {})).toBeTruthy();
      expect(validator(ethereumAddress, {})).toBeTruthy();
    })
  });
})