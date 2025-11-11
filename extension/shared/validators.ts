/**
 * Validators for Nockchain addresses and other data
 */

import { base58 } from '@scure/base';

/**
 * Validates a Nockchain V1 PKH address
 * V1 PKH addresses are TIP5 hash (40 bytes) of public key, base58 encoded
 * Base58 encoding of 40 bytes results in 54-55 characters (typically 55)
 *
 * Validates by decoding the base58 string and checking for exactly 40 bytes
 * rather than relying on character count which can vary
 */
export const isNockAddress = (s: string): boolean => {
  try {
    const trimmed = (s || '').trim();
    if (trimmed.length === 0) return false;

    const bytes = base58.decode(trimmed);
    return bytes.length === 40;
  } catch {
    // Invalid base58 encoding
    return false;
  }
};
