/**
 * Shared TypeScript types and interfaces
 */

import { PROVIDER_METHODS, INTERNAL_METHODS, RPC_METHODS, ERROR_CODES } from './constants';

/**
 * Account information for multi-account wallet
 * Each account is derived from the same mnemonic using BIP-44 derivation paths
 */
export interface Account {
  /** User-defined account name (editable) */
  name: string;
  /** Nockchain address (132 chars, Base58-encoded) */
  address: string;
  /** BIP-44 derivation index (0, 1, 2, ...) */
  index: number;
}

/**
 * Type for all valid RPC method names
 */
export type RPCMethod = (typeof RPC_METHODS)[keyof typeof RPC_METHODS];

/**
 * Type for provider method names only
 */
export type ProviderMethod = (typeof PROVIDER_METHODS)[keyof typeof PROVIDER_METHODS];

/**
 * Type for internal method names only
 */
export type InternalMethod = (typeof INTERNAL_METHODS)[keyof typeof INTERNAL_METHODS];

/**
 * Type for all valid error codes
 */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Transaction information
 * Represents a blockchain transaction (sent or received)
 */
export interface Transaction {
  /** Unique transaction ID */
  id: string;
  /** Transaction type */
  type: 'sent' | 'received';
  /** Amount in NOCK */
  amount: number;
  /** Counterparty address (sender for received, recipient for sent) */
  address: string;
  /** Transaction timestamp */
  timestamp: Date;
  /** Transaction status */
  status: 'confirmed' | 'pending' | 'failed';
}

/**
 * Transaction details for confirmation screen
 * Used to display transaction details immediately after sending
 */
export interface TransactionDetails {
  /** Transaction ID */
  txid: string;
  /** Amount in NOCK */
  amount: number;
  /** Transaction fee in NOCK */
  fee: number;
  /** Recipient address */
  to?: string;
  /** Sender address */
  from?: string;
}
