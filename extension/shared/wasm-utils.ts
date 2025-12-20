/**
 * WASM Utilities
 * Centralized utilities for loading and initializing WASM modules
 */

import initWasm from '@nockbox/iris-wasm/iris_wasm.js';

/**
 * Track if WASM modules have been initialized (per-context)
 */
let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;
const IRIS_WASM_INIT_KEY = '__iris_wasm_init_promise__';

/**
 * Initialize WASM modules (low-level).
 */
export async function initWasmModules(): Promise<void> {
  // Let the wasm-bindgen loader resolve the `.wasm` URL via `import.meta.url`.
  // Vite will rewrite that into a hashed asset (e.g. `dist/assets/iris_wasm_bg-<hash>.wasm`)
  // and the extension can fetch it from its own origin.
  await initWasm();
}

/**
 * Initialize Iris WASM once per context (promise-cached).
 * Concurrent callers share a single init Promise (SDK-style).
 */
export async function initIrisSdkOnce(): Promise<void> {
  if (wasmInitialized) return;

  // Extra safety: cache on globalThis as well (mirrors SDK pattern).
  // Note: This still does NOT share init across extension contexts (popup vs background),
  // because each context has its own globalThis.
  const g = globalThis as typeof globalThis & Record<string, unknown>;
  const globalPromise = g[IRIS_WASM_INIT_KEY];
  if (globalPromise && globalPromise instanceof Promise) {
    wasmInitPromise = globalPromise as Promise<void>;
    await wasmInitPromise;
    wasmInitialized = true;
    return;
  }

  if (!wasmInitPromise) {
    wasmInitPromise = initWasmModules()
      .then(() => {
        wasmInitialized = true;
      })
      .catch((err: unknown) => {
        // Allow retry after a failed init
        wasmInitPromise = null;
        throw err;
      });
    g[IRIS_WASM_INIT_KEY] = wasmInitPromise;
  }

  await wasmInitPromise;
}
