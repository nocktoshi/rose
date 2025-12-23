/**
 * `@nockchain/sdk/wasm`
 *
 * Convenience re-export of the Rose WASM package so consumers can import:
 *   - `@nockchain/sdk/wasm`
 * instead of:
 *   - `@nockchain/rose-wasm/rose_wasm.js`
 *
 * This mirrors the "SDK owns WASM surface" pattern used elsewhere in the repo.
 */

export * from '@nockchain/rose-wasm/rose_wasm.js';
export { default } from '@nockchain/rose-wasm/rose_wasm.js';
