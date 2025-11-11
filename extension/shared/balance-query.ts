/**
 * High-level balance query functions for Nockchain v1 addresses
 *
 * This module provides functions to query the balance of v1 PKH addresses
 * by deriving the expected first-names for standard lock types and querying
 * the gRPC API.
 */

import { NockchainBrowserRPCClient } from './rpc-client-browser';
import { getBothFirstNames } from './first-name-derivation';
import type { Note } from './types';

/**
 * Result of a balance query
 */
export interface BalanceResult {
  /** Total balance in nicks (1 NOCK = 65,536 nicks) */
  totalNicks: bigint;
  /** Total balance in NOCK (for display) */
  totalNock: number;
  /** Simple (non-coinbase) notes */
  simpleNotes: Note[];
  /** Coinbase (mining reward) notes */
  coinbaseNotes: Note[];
  /** Total number of UTXOs/notes */
  utxoCount: number;
}

/**
 * Query the balance for a v1 PKH address
 *
 * This function:
 * 1. Derives the expected first-names for both simple and coinbase notes
 * 2. Queries the gRPC API for notes with each first-name
 * 3. Combines and sums the results
 *
 * @param pkhBase58 - The base58-encoded v1 PKH address (~55 chars)
 * @param rpcClient - The gRPC client to use for queries
 * @returns Balance information including notes and totals
 *
 * @example
 * ```typescript
 * import { createBrowserClient } from './rpc-client-browser';
 * import { queryV1Balance } from './balance-query';
 *
 * const client = createBrowserClient();
 * const myPKH = "2R7Z8p..."; // Your v1 PKH address
 * const balance = await queryV1Balance(myPKH, client);
 *
 * console.log(`Balance: ${balance.totalNock} NOCK`);
 * console.log(`UTXOs: ${balance.utxoCount}`);
 * console.log(`Simple notes: ${balance.simpleNotes.length}`);
 * console.log(`Mining rewards: ${balance.coinbaseNotes.length}`);
 * ```
 */
export async function queryV1Balance(
  pkhBase58: string,
  rpcClient: NockchainBrowserRPCClient
): Promise<BalanceResult> {
  console.log(`[Balance Query] Querying v1 balance for PKH ${pkhBase58.slice(0, 20)}...`);

  // Derive both first-names
  const { simple, coinbase } = await getBothFirstNames(pkhBase58);
  console.log(`[Balance Query] Derived first-names:`, {
    simple: simple.slice(0, 20) + '...',
    coinbase: coinbase.slice(0, 20) + '...',
  });

  // Query both types of notes in parallel
  const [simpleNotes, coinbaseNotes] = await Promise.all([
    rpcClient.getNotesByFirstName(simple),
    rpcClient.getNotesByFirstName(coinbase),
  ]);

  console.log(`[Balance Query] Found notes:`, {
    simpleNotes: simpleNotes.length,
    coinbaseNotes: coinbaseNotes.length,
  });

  // Sum the total value in nicks
  const totalNicks = [...simpleNotes, ...coinbaseNotes].reduce(
    (sum, note) => sum + BigInt(note.assets),
    0n
  );

  // Convert to NOCK for display (1 NOCK = 65,536 nicks)
  const NICKS_PER_NOCK = 65536;
  const totalNock = Number(totalNicks) / NICKS_PER_NOCK;

  const result = {
    totalNicks,
    totalNock,
    simpleNotes,
    coinbaseNotes,
    utxoCount: simpleNotes.length + coinbaseNotes.length,
  };

  console.log(`[Balance Query] ✅ Balance result:`, {
    totalNicks: totalNicks.toString(),
    totalNock,
    utxoCount: result.utxoCount,
    simpleNotesCount: simpleNotes.length,
    coinbaseNotesCount: coinbaseNotes.length,
  });

  return result;
}

/**
 * Query only simple (non-coinbase) notes for a v1 PKH address
 *
 * Use this if you only care about regular transaction outputs.
 *
 * @param pkhBase58 - The base58-encoded v1 PKH address (~55 chars)
 * @param rpcClient - The gRPC client to use for queries
 * @returns Array of simple notes
 */
export async function querySimpleNotes(
  pkhBase58: string,
  rpcClient: NockchainBrowserRPCClient
): Promise<Note[]> {
  const { simple } = await getBothFirstNames(pkhBase58);
  return rpcClient.getNotesByFirstName(simple);
}

/**
 * Query only coinbase (mining reward) notes for a v1 PKH address
 *
 * Use this if you only care about mining rewards.
 *
 * NOTE: The coinbase lock structure currently uses placeholder timelock parameters.
 * This will need to be updated once we extract the exact coinbase timelock from Hoon.
 *
 * @param pkhBase58 - The base58-encoded v1 PKH address (~55 chars)
 * @param rpcClient - The gRPC client to use for queries
 * @returns Array of coinbase notes
 */
export async function queryCoinbaseNotes(
  pkhBase58: string,
  rpcClient: NockchainBrowserRPCClient
): Promise<Note[]> {
  const { coinbase } = await getBothFirstNames(pkhBase58);
  return rpcClient.getNotesByFirstName(coinbase);
}
