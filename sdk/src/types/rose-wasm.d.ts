/**
 * Type declarations for Rose WASM JS entrypoint.
 *
 * With `moduleResolution: "bundler"`, TypeScript can fail to associate the
 * package-provided `.d.ts` with the `.js` entrypoint path, so we bridge it here.
 */

/// <reference path="@nockchain/rose-wasm/rose_wasm.d.ts" />

declare module '@nockchain/rose-wasm/rose_wasm.js' {
  export * from '@nockchain/rose-wasm/rose_wasm';
  import init from '@nockchain/rose-wasm/rose_wasm';
  export default init;
}
