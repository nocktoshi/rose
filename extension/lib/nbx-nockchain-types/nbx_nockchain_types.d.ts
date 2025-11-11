/* tslint:disable */
/* eslint-disable */
/**
 * Derive the first-name from a lock hash
 *
 * This implements the v1 first-name derivation algorithm:
 * first-name = hash([true, lock-hash])
 *
 * Arguments:
 * - lock_hash: Base58-encoded digest string (the hash of a lock structure)
 *
 * Returns:
 * - Base58-encoded digest string representing the first-name
 */
export function deriveFirstNameFromLockHash(lock_hash: string): string;
/**
 * Derive the first-name for a simple PKH-locked note
 *
 * Creates a 1-of-1 PKH lock and derives the first-name from it.
 * Use this for querying regular transaction outputs.
 *
 * Arguments:
 * - pkh_hash: Base58-encoded digest string (TIP5 hash of the public key)
 *
 * Returns:
 * - Base58-encoded digest string representing the first-name
 */
export function deriveSimpleFirstName(pkh_hash: string): string;
/**
 * Derive the first-name for a coinbase (mining reward) note
 *
 * Creates a coinbase lock which includes both a PKH lock and a 100-block timelock.
 * Use this for querying mining rewards.
 *
 * Arguments:
 * - pkh_hash: Base58-encoded digest string (TIP5 hash of the public key)
 *
 * Returns:
 * - Base58-encoded digest string representing the first-name
 */
export function deriveCoinbaseFirstName(pkh_hash: string): string;
/**
 * Derive master key from seed bytes
 */
export function deriveMasterKey(seed: Uint8Array): WasmExtendedKey;
/**
 * Derive master key from BIP39 mnemonic phrase
 */
export function deriveMasterKeyFromMnemonic(mnemonic: string, passphrase?: string | null): WasmExtendedKey;
export class WasmDigest {
  free(): void;
  [Symbol.dispose](): void;
  constructor(value: string);
  readonly value: string;
}
export class WasmExtendedKey {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Derive a child key at the given index
   */
  deriveChild(index: number): WasmExtendedKey;
  readonly private_key: Uint8Array | undefined;
  readonly public_key: Uint8Array;
  readonly chain_code: Uint8Array;
}
export class WasmLockPrimitive {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  static newPkh(pkh: WasmPkh): WasmLockPrimitive;
  static newTim(tim: WasmLockTim): WasmLockPrimitive;
  static newBrn(): WasmLockPrimitive;
}
export class WasmLockTim {
  free(): void;
  [Symbol.dispose](): void;
  constructor(rel: WasmTimelockRange, abs: WasmTimelockRange);
  static coinbase(): WasmLockTim;
  readonly rel: WasmTimelockRange;
  readonly abs: WasmTimelockRange;
}
export class WasmName {
  free(): void;
  [Symbol.dispose](): void;
  constructor(first: string, last: string);
  readonly first: string;
  readonly last: string;
}
export class WasmNote {
  free(): void;
  [Symbol.dispose](): void;
  constructor(version: WasmVersion, origin_page: number, name: WasmName, note_data_hash: WasmDigest, assets: number);
  hash(): WasmDigest;
  readonly version: WasmVersion;
  readonly originPage: number;
  readonly name: WasmName;
  readonly noteDataHash: WasmDigest;
  readonly assets: number;
}
export class WasmPkh {
  free(): void;
  [Symbol.dispose](): void;
  constructor(m: bigint, hashes: string[]);
  static single(hash: string): WasmPkh;
  readonly m: bigint;
  readonly hashes: string[];
}
export class WasmRawTx {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly version: WasmVersion;
  readonly id: WasmDigest;
}
export class WasmSeed {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  static newSinglePkh(pkh: WasmDigest, gift: number, parent_hash: WasmDigest): WasmSeed;
  readonly lockRoot: WasmDigest;
  readonly gift: number;
  readonly parentHash: WasmDigest;
}
export class WasmSpendCondition {
  free(): void;
  [Symbol.dispose](): void;
  constructor(primitives: WasmLockPrimitive[]);
  static newPkh(pkh: WasmPkh): WasmSpendCondition;
  hash(): WasmDigest;
}
export class WasmTimelockRange {
  free(): void;
  [Symbol.dispose](): void;
  constructor(min?: number | null, max?: number | null);
  readonly min: number | undefined;
  readonly max: number | undefined;
}
export class WasmTxBuilder {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a simple transaction builder
   */
  static newSimple(notes: WasmNote[], spend_condition: WasmSpendCondition, recipient: WasmDigest, gift: number, fee: number, refund_pkh: WasmDigest): WasmTxBuilder;
  /**
   * Sign the transaction with a private key
   */
  sign(signing_key_bytes: Uint8Array): WasmRawTx;
}
export class WasmVersion {
  free(): void;
  [Symbol.dispose](): void;
  constructor(version: number);
  static V0(): WasmVersion;
  static V1(): WasmVersion;
  static V2(): WasmVersion;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmdigest_free: (a: number, b: number) => void;
  readonly wasmdigest_new: (a: number, b: number) => number;
  readonly wasmdigest_value: (a: number) => [number, number];
  readonly __wbg_wasmversion_free: (a: number, b: number) => void;
  readonly wasmversion_new: (a: number) => number;
  readonly wasmversion_V0: () => number;
  readonly wasmversion_V1: () => number;
  readonly wasmversion_V2: () => number;
  readonly __wbg_wasmname_free: (a: number, b: number) => void;
  readonly wasmname_new: (a: number, b: number, c: number, d: number) => number;
  readonly wasmname_first: (a: number) => [number, number];
  readonly wasmname_last: (a: number) => [number, number];
  readonly __wbg_wasmtimelockrange_free: (a: number, b: number) => void;
  readonly wasmtimelockrange_new: (a: number, b: number) => number;
  readonly wasmtimelockrange_min: (a: number) => number;
  readonly wasmtimelockrange_max: (a: number) => number;
  readonly __wbg_wasmnote_free: (a: number, b: number) => void;
  readonly wasmnote_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly wasmnote_version: (a: number) => number;
  readonly wasmnote_originPage: (a: number) => number;
  readonly wasmnote_name: (a: number) => number;
  readonly wasmnote_noteDataHash: (a: number) => number;
  readonly wasmnote_assets: (a: number) => number;
  readonly wasmnote_hash: (a: number) => number;
  readonly __wbg_wasmpkh_free: (a: number, b: number) => void;
  readonly wasmpkh_new: (a: bigint, b: number, c: number) => number;
  readonly wasmpkh_single: (a: number, b: number) => number;
  readonly wasmpkh_m: (a: number) => bigint;
  readonly wasmpkh_hashes: (a: number) => [number, number];
  readonly __wbg_wasmlocktim_free: (a: number, b: number) => void;
  readonly wasmlocktim_new: (a: number, b: number) => number;
  readonly wasmlocktim_coinbase: () => number;
  readonly wasmlocktim_rel: (a: number) => number;
  readonly wasmlocktim_abs: (a: number) => number;
  readonly __wbg_wasmlockprimitive_free: (a: number, b: number) => void;
  readonly wasmlockprimitive_newPkh: (a: number) => number;
  readonly wasmlockprimitive_newTim: (a: number) => number;
  readonly wasmlockprimitive_newBrn: () => number;
  readonly __wbg_wasmspendcondition_free: (a: number, b: number) => void;
  readonly wasmspendcondition_new: (a: number, b: number) => number;
  readonly wasmspendcondition_newPkh: (a: number) => number;
  readonly wasmspendcondition_hash: (a: number) => [number, number, number];
  readonly __wbg_wasmseed_free: (a: number, b: number) => void;
  readonly wasmseed_newSinglePkh: (a: number, b: number, c: number) => number;
  readonly wasmseed_lockRoot: (a: number) => number;
  readonly wasmseed_gift: (a: number) => number;
  readonly wasmseed_parentHash: (a: number) => number;
  readonly __wbg_wasmtxbuilder_free: (a: number, b: number) => void;
  readonly wasmtxbuilder_newSimple: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number, number];
  readonly wasmtxbuilder_sign: (a: number, b: number, c: number) => [number, number, number];
  readonly __wbg_wasmrawtx_free: (a: number, b: number) => void;
  readonly wasmrawtx_version: (a: number) => number;
  readonly wasmrawtx_id: (a: number) => number;
  readonly deriveFirstNameFromLockHash: (a: number, b: number) => [number, number];
  readonly deriveSimpleFirstName: (a: number, b: number) => [number, number];
  readonly deriveCoinbaseFirstName: (a: number, b: number) => [number, number];
  readonly __wbg_wasmextendedkey_free: (a: number, b: number) => void;
  readonly wasmextendedkey_private_key: (a: number) => [number, number];
  readonly wasmextendedkey_public_key: (a: number) => [number, number];
  readonly wasmextendedkey_chain_code: (a: number) => [number, number];
  readonly wasmextendedkey_deriveChild: (a: number, b: number) => [number, number, number];
  readonly deriveMasterKey: (a: number, b: number) => number;
  readonly deriveMasterKeyFromMnemonic: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
