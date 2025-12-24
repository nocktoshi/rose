/**
 * WASM Utilities
 * Centralized utilities for loading and initializing WASM modules
 */

import initWasm from '@nockchain/rose-wasm/rose_wasm.js';

/**
 * Track if WASM modules have been initialized (per-context)
 */
let wasmInitialized = false;
const IRIS_WASM_INIT_KEY = '__rose_wasm_init_promise__';

/**
 * Initialize WASM modules (low-level, no caching).
 *
 * Prefer calling `initIrisSdkOnce()` (or its aliases) instead.
 */
async function initWasmModulesRaw(): Promise<void> {
  // Let the wasm-bindgen loader resolve the `.wasm` URL via `import.meta.url`.
  // Vite will rewrite that into a hashed asset (e.g. `dist/assets/rose_wasm_bg-<hash>.wasm`)
  // and the extension can fetch it from its own origin.
  await initWasm();
}

/**
 * Initialize Rose WASM once per context (promise-cached).
 * Concurrent callers share a single init Promise (SDK-style).
 */
export async function initIrisSdkOnce(): Promise<void> {
  if (wasmInitialized) return;

  const g = globalThis as typeof globalThis & Record<string, unknown>;
  const existing = g[IRIS_WASM_INIT_KEY];

  if (existing && existing instanceof Promise) {
    return existing.catch(err => {
      if (g[IRIS_WASM_INIT_KEY] === existing) {
        delete g[IRIS_WASM_INIT_KEY];
      }
      throw err;
    });
  }

  const p = initWasmModulesRaw()
    .then(() => {
      wasmInitialized = true;
    })
    .catch(err => {
      if (g[IRIS_WASM_INIT_KEY] === p) {
        delete g[IRIS_WASM_INIT_KEY];
      }
      throw err;
    });

  g[IRIS_WASM_INIT_KEY] = p;
  await p;
}

/**
 * Back-compat alias.
 * Historically, the codebase used `ensureWasmInitialized()` to mean "once per context".
 */
export async function ensureWasmInitialized(): Promise<void> {
  return initIrisSdkOnce();
}

/**
 * Exported for compatibility with recent call sites.
 *
 * Important: despite the name, this is intentionally **deduped** and safe to call many times.
 * If you truly need a raw init (rare), use a dedicated helper in this module.
 */
export async function initWasmModules(): Promise<void> {
  return initIrisSdkOnce();
}
