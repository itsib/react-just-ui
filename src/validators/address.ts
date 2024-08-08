import { ValidationFn } from '../types';

export function btcAddress(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    return /^(bc1|[13])[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(value) ? true : error;
  }
}

export function ethAddress(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    return /^0x[0-9a-fA-F]{42}$/.test(value) ? true : error;
  }
}

/**
 * Validate solana address
 * @link https://solana.com/docs/more/exchange#basic-verification
 * @param error Error message
 */
export function solanaAddress(error: any): ValidationFn {
  return (value: string) => {
    if (!value) return true;

    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value) ? true : error;
  }
}