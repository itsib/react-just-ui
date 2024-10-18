import { describe, it, expect } from 'vitest';
import { btcAddress, ethAddress, solanaAddress } from './address';

describe('validators/address.ts', () => {
  describe('#btcAddress', () => {
    const mainnetAddress = '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem';
    const testnetAddress = 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn';
    const invalidAddress = '17VZNX1SN5NtKO8UQFxwQbFeFc3iqRYhem';

    it('validates Mainnet', () => {
      const validator = btcAddress('error_message');

      expect(validator(mainnetAddress, {})).toStrictEqual(true);
      expect(validator(testnetAddress, {})).toEqual('error_message');
    });

    it('validates Testnet', () => {
      const validator = btcAddress('error_message', true);

      expect(validator(testnetAddress, {})).toStrictEqual(true);
      expect(validator(mainnetAddress, {})).toEqual('error_message');
    });

    it('fails check error message', () => {
      const validator = btcAddress('error_message');

      expect(validator(invalidAddress, {})).toEqual('error_message');
    });

    it('empty value shouldn\'t invalid', () => {
      const validator = btcAddress('error_message');

      expect(validator('', {})).toStrictEqual(true);
    });
  })

  describe('#ethAddress', () => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const ethereumAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const invalidAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEe';

    it('validate ETH & zero addresses', () => {
      const validator = ethAddress('error_message');

      expect(validator(zeroAddress, {})).toStrictEqual(true);
      expect(validator(ethereumAddress, {})).toStrictEqual(true);
    });

    it('invalid address', () => {
      const validator = ethAddress('error_message');
      expect(validator(invalidAddress, {})).not.toStrictEqual(true);
      expect(validator(invalidAddress, {})).toStrictEqual('error_message');
    });

    it('empty value shouldn\'t invalid', () => {
      const validator = ethAddress('error_message');

      expect(validator('', {})).toStrictEqual(true);
    });
  });

  describe('#solanaAddress', () => {
    const mainnet0 = 'HEL1USMZKAL2odpNBj2oCjffnFGaYwmbGmyewGv1e2TU';
    const mainnet1 = 'he1iusunGwqrNtafDtLdhsUQDFvo13z9sUa36PauBtk';
    const mainnet2 = 'BNKnJmHkorgm9iz1aNczvwuAmwtpZiSDiuLT8XC2tcNr';
    const mainnet3 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7CnhcD';
    const mainnet4 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch';
    const invalid0 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1C';
    const invalid1 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7CnhcDd';
    const invalid2 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7Cnhc0';
    const invalid3 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7Cnhcl';
    const invalid4 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7CnhcI';
    const invalid5 = 'DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7CnhcO';

    it('validate solana addresses', () => {
      const validator = solanaAddress('error_message');

      expect(validator(mainnet0, {})).toStrictEqual(true);
      expect(validator(mainnet1, {})).toStrictEqual(true);
      expect(validator(mainnet2, {})).toStrictEqual(true);
      expect(validator(mainnet3, {})).toStrictEqual(true);
      expect(validator(mainnet4, {})).toStrictEqual(true);
    });

    it('invalid solana addresses', () => {
      const validator = solanaAddress('error_message');

      expect(validator(invalid0, {})).toStrictEqual('error_message');
      expect(validator(invalid1, {})).toStrictEqual('error_message');
      expect(validator(invalid2, {})).toStrictEqual('error_message');
      expect(validator(invalid3, {})).toStrictEqual('error_message');
      expect(validator(invalid4, {})).toStrictEqual('error_message');
      expect(validator(invalid5, {})).toStrictEqual('error_message');
    });

    it('empty value shouldn\'t invalid', () => {
      const validator = solanaAddress('error_message');

      expect(validator('', {})).toStrictEqual(true);
    });
  });
})