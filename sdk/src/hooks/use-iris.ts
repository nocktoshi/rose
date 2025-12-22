import { useEffect, useMemo, useState } from 'react';
import { NockchainProvider } from '../provider.js';
import initWasm, { GrpcClient } from '@nockbox/iris-wasm/iris_wasm.js';

const IRIS_SDK_WASM_INIT_KEY = '__nockbox_iris_sdk_wasm_init_promise__';
const IRIS_SDK_PROVIDER_KEY = '__nockbox_iris_sdk_provider__';

/**
 * Initialize Iris WASM once per page load.
 * Uses globalThis so React StrictMode + Vite HMR won't accidentally re-init.
 */
type WasmInit = ReturnType<typeof initWasm>;

function ensureWasmInitializedOnce(): WasmInit {
  const g = globalThis as typeof globalThis & Record<string, unknown>;

  const existing = g[IRIS_SDK_WASM_INIT_KEY];
  // If a previous init attempt failed, the cached Promise may be rejected.
  // Ensure we clear the cached value on failure so callers can retry without a full refresh.
  if (existing && existing instanceof Promise) {
    return (existing as WasmInit).catch(err => {
      // Only clear if we're still pointing at this promise (avoid races).
      if (g[IRIS_SDK_WASM_INIT_KEY] === existing) {
        delete g[IRIS_SDK_WASM_INIT_KEY];
      }
      throw err;
    }) as WasmInit;
  }

  const p = initWasm().catch(err => {
    // Allow retry after a failed init
    if (g[IRIS_SDK_WASM_INIT_KEY] === p) {
      delete g[IRIS_SDK_WASM_INIT_KEY];
    }
    throw err;
  }) as WasmInit;

  g[IRIS_SDK_WASM_INIT_KEY] = p;
  return p;
}

function getProviderOnce(): NockchainProvider {
  const g = globalThis as typeof globalThis & Record<string, unknown>;
  const existing = g[IRIS_SDK_PROVIDER_KEY];
  if (existing instanceof NockchainProvider) return existing;

  const provider = new NockchainProvider();
  g[IRIS_SDK_PROVIDER_KEY] = provider;
  return provider;
}

export type UseIrisStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useIris({ rpcUrl = 'https://rpc.nockbox.org' }: { rpcUrl?: string } = {}) {
  const [provider, setProvider] = useState<NockchainProvider | null>(null);
  const [rpcClient, setRpcClient] = useState<GrpcClient | null>(null);
  const [status, setStatus] = useState<UseIrisStatus>('idle');
  const [error, setError] = useState<unknown>(null);

  // Stable options key; prevents unnecessary re-inits
  const options = useMemo(() => ({ rpcUrl }), [rpcUrl]);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    ensureWasmInitializedOnce()
      .then(() => {
        if (cancelled) return;
        setProvider(getProviderOnce());
        setRpcClient(new GrpcClient(options.rpcUrl));
        setStatus('ready');
      })
      .catch(err => {
        if (cancelled) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [options]);

  return {
    provider,
    rpcClient,
    wasm: initWasm,
    status,
    error,
    isReady: status === 'ready',
  };
}
