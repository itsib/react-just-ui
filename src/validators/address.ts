import type { ValidationFn } from '../types';

/**
 * Validate Bitcoin address
 *
 * @remarks
 * Passive validation of the Bitcoin blockchain address
 * with regexp `/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/`
 * for mainnet. `/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/`
 * for testnet.
 *
 * For more information, see
 * {@link https://github.com/NoriSte/bitcoin-address-soft-regex-validation/blob/master/index.js | GitHub repository}
 *
 * @param error - The error text that will be displayed inside the form element.
 *
 * @param testnet - If true btc address is testnet.
 *
 * @returns Validation callback {@link ValidationFn | function}.
 *
 * @public
 */
export function btcAddress(error: any, testnet = false): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    if (testnet) {
      return /^(tb1|[2nm]|bcrt)[a-zA-HJ-NP-Z0-9]{25,40}$/.test(value) ? true : error;
    }
    return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(value) ? true : error;
  }
}

/**
 * Validate Ethereum address.
 *
 * Passive validation of the Ethereum blockchain address
 * with regexp `/^0x[0-9a-fA-F]{42}$/`. All EVM addresses
 * is 42 symbols hex value with prefix "0x"
 *
 * @param error - The error text that will be displayed inside the form element.
 *
 * @returns Validation callback {@link ValidationFn | function}.
 *
 * @public
 */
export function ethAddress(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    if (value.length !== 42) return error;
    if (!value.startsWith('0x')) return error;

    return /^0x[0-9a-fA-F]{42}$/.test(value) ? true : error;
  }
}

/**
 * Validate solana address
 *
 * @remarks
 * Passive validation of the solana blockchain address
 * with regexp `/^[1-9A-HJ-NP-Za-km-z]{32,44}$/`
 * For more information, see
 * {@link https://solana.com/docs/more/exchange#basic-verification | Solana basic verification}
 *
 * @param error - The error text that will be displayed inside the form element.
 *
 * @returns Validation callback {@link ValidationFn | function}.
 *
 * @public
 */
export function solanaAddress(error: string): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value) ? true : error;
  }
}