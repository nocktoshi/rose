/**
 * First-name derivation utilities for Nockchain v1 notes
 *
 * In Nockchain v1, notes are indexed by "first-names" which are deterministically
 * derived from their lock conditions. This module provides functions to calculate
 * the expected first-name for standard lock types (simple PKH and coinbase).
 *
 * NOTE: The WASM functions take base58-encoded strings as input and return
 * base58-encoded strings as output. No additional encoding/decoding is needed.
 */

// ✅ Pull the WASM into the build graph and get a runtime URL
import wasmUrl from '../lib/nbx-nockchain-types/nbx_nockchain_types_bg.wasm?url';

// Import the glue as a module namespace
import * as nbt from '../lib/nbx-nockchain-types/nbx_nockchain_types.js';

let wasmReady: Promise<void> | null = null;

// Store function references after init
// Note: These WASM functions take base58 strings and return base58 strings
let wasmDeriveSimpleFirstName: (pkhBase58: string) => string;
let wasmDeriveCoinbaseFirstName: (pkhBase58: string) => string;
let wasmDeriveFirstNameFromLockHash: (lockHashBase58: string) => string;

/**
 * Ensures WASM module is initialized
 * Must be called before using any WASM functions
 */
async function ensureWasmInit(): Promise<void> {
  if (!wasmReady) {
    wasmReady = (async () => {
      console.log('[WASM Debug] Loading WASM from:', wasmUrl);

      // Initialize the WASM module
      await nbt.default({ module_or_path: wasmUrl });

      // Use the JS wrapper functions from the module (not raw WASM exports)
      // These wrappers handle string encoding/decoding automatically
      wasmDeriveSimpleFirstName = nbt.deriveSimpleFirstName;
      wasmDeriveCoinbaseFirstName = nbt.deriveCoinbaseFirstName;
      wasmDeriveFirstNameFromLockHash = nbt.deriveFirstNameFromLockHash;

      if (typeof wasmDeriveSimpleFirstName !== 'function') {
        throw new Error(
          'nbx-nockchain-types: deriveSimpleFirstName not found in module exports'
        );
      }

      console.log('[WASM Debug] WASM initialized and function references stored');
    })();
  }
  return wasmReady;
}

/**
 * Derives the first-name for a simple PKH-locked note
 *
 * This is used for regular transaction outputs (non-coinbase).
 * The lock structure is: [(pkh, m=1, hashes=[your_pkh])]
 *
 * @param pkhBase58 - The base58-encoded PKH address (~55 chars)
 * @returns The base58-encoded first-name hash (40 bytes encoded)
 *
 * @example
 * ```typescript
 * const myPKH = "2R7Z8p..."; // Your v1 PKH address
 * const firstName = await deriveSimpleFirstName(myPKH);
 * // Use firstName to query notes via gRPC API
 * ```
 */
export async function deriveSimpleFirstName(pkhBase58: string): Promise<string> {
  await ensureWasmInit();

  // Validate PKH is a non-empty string
  if (!pkhBase58 || typeof pkhBase58 !== 'string') {
    throw new Error('PKH must be a non-empty base58 string');
  }

  console.log('[First-Name] Input PKH:', {
    length: pkhBase58.length,
    full: pkhBase58
  });

  // Call WASM function to derive first-name (takes base58, returns base58)
  const firstNameBase58 = wasmDeriveSimpleFirstName(pkhBase58);

  console.log('[First-Name] ✅ Derived simple first-name:', {
    length: firstNameBase58.length,
    full: firstNameBase58
  });

  // Verify it's the right length (40 bytes → ~55 chars base58)
  if (firstNameBase58.length < 50 || firstNameBase58.length > 60) {
    console.warn(`[First-Name] ⚠️ WARNING: First-name length ${firstNameBase58.length} is outside expected range 50-60 chars`);
  }

  return firstNameBase58;
}

/**
 * Derives the first-name for a coinbase (mining reward) note
 *
 * This is used for mining rewards which include both a PKH lock and a timelock.
 * The lock structure is: [(pkh, m=1, hashes=[your_pkh]), (tim, timelock)]
 *
 * NOTE: The coinbase timelock parameters are currently placeholders.
 * This function will need to be updated with the exact timelock structure from Hoon.
 *
 * @param pkhBase58 - The base58-encoded PKH address (~55 chars)
 * @returns The base58-encoded first-name hash (40 bytes encoded)
 *
 * @example
 * ```typescript
 * const myPKH = "2R7Z8p..."; // Your v1 PKH address
 * const firstName = await deriveCoinbaseFirstName(myPKH);
 * // Use firstName to query mining rewards via gRPC API
 * ```
 */
export async function deriveCoinbaseFirstName(pkhBase58: string): Promise<string> {
  await ensureWasmInit();

  // Validate PKH is a non-empty string
  if (!pkhBase58 || typeof pkhBase58 !== 'string') {
    throw new Error('PKH must be a non-empty base58 string');
  }

  // Call WASM function to derive first-name (takes base58, returns base58)
  const firstNameBase58 = wasmDeriveCoinbaseFirstName(pkhBase58);

  console.log('[First-Name] ✅ Derived coinbase first-name:', {
    length: firstNameBase58.length,
    full: firstNameBase58
  });

  // Verify it's the right length (40 bytes → ~55 chars base58)
  if (firstNameBase58.length < 50 || firstNameBase58.length > 60) {
    console.warn(`[First-Name] ⚠️ WARNING: Coinbase first-name length ${firstNameBase58.length} is outside expected range 50-60 chars`);
  }

  return firstNameBase58;
}

/**
 * Low-level function to derive a first-name from a lock hash
 *
 * This implements the core v1 first-name derivation algorithm:
 * first-name = hash([true, lock-hash])
 *
 * Most users should use deriveSimpleFirstName() or deriveCoinbaseFirstName() instead.
 *
 * @param lockHashBase58 - The base58-encoded lock hash (40 bytes)
 * @returns The base58-encoded first-name hash (40 bytes encoded)
 */
export async function deriveFirstNameFromLockHash(lockHashBase58: string): Promise<string> {
  await ensureWasmInit();

  // Validate lock hash is a non-empty string
  if (!lockHashBase58 || typeof lockHashBase58 !== 'string') {
    throw new Error('Lock hash must be a non-empty base58 string');
  }

  // Call WASM function to derive first-name (takes base58, returns base58)
  const firstNameBase58 = wasmDeriveFirstNameFromLockHash(lockHashBase58);

  return firstNameBase58;
}

/**
 * Helper to get both first-names for a given PKH address
 *
 * Returns both simple and coinbase first-names so you can query
 * both regular transaction outputs and mining rewards in a single call.
 *
 * @param pkhBase58 - The base58-encoded PKH address (~55 chars)
 * @returns Object containing both first-names
 *
 * @example
 * ```typescript
 * const myPKH = "2R7Z8p...";
 * const { simple, coinbase } = await getBothFirstNames(myPKH);
 *
 * // Query both types of notes
 * const [simpleNotes, coinbaseNotes] = await Promise.all([
 *   queryNotesByFirstName(simple),
 *   queryNotesByFirstName(coinbase),
 * ]);
 * ```
 */
export async function getBothFirstNames(pkhBase58: string): Promise<{
  simple: string;
  coinbase: string;
}> {
  await ensureWasmInit();

  return {
    simple: await deriveSimpleFirstName(pkhBase58),
    coinbase: await deriveCoinbaseFirstName(pkhBase58),
  };
}
