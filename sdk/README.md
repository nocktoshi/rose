# `@nockchain/sdk`

TypeScript SDK for interacting with the **Rose** browser wallet extension (Nockchain).

## Install

```bash
npm i @nockchain/sdk
```

## What you get

- **`NockchainProvider`**: connect to Rose and request signatures / transactions (EIP-1193-ish API).
- **`TransactionBuilder`**: small fluent helper for constructing the simple “send transaction” payload.
- **WASM**: use `@nockchain/rose-wasm` directly for `TxBuilder`, `GrpcClient`, etc.
- **React Hook**: `useIris()` for one-time WASM init + gRPC client + provider wiring.

## Basic usage (provider)

```ts
import { NockchainProvider } from '@nockchain/sdk';

const provider = new NockchainProvider();
const { pkh, grpcEndpoint } = await provider.connect();

const sig = await provider.signMessage('hello');
console.log(sig.signature, sig.publicKeyHex);
```

## Building a simple transaction payload

```ts
import { NockchainProvider, TransactionBuilder } from '@nockchain/sdk';

const provider = new NockchainProvider();
await provider.connect();

const tx = new TransactionBuilder().to('...recipient_pkh...').amount(1_000_000).build();
const txId = await provider.sendTransaction(tx);
```

## WASM / raw transaction signing

If you’re using `@nockchain/rose-wasm` types like `TxBuilder`, import them directly:

```ts
import {
  TxBuilder,
  Pkh,
  SpendCondition,
  Digest,
  GrpcClient,
  RawTx,
  Note,
} from '@nockchain/rose-wasm/rose_wasm.js';
import { NockchainProvider } from '@nockchain/sdk';
```

See `sdk/examples/` for an end-to-end example of building + signing a raw transaction.

## React: `useIris` hook

```tsx
import { useIris } from '@nockchain/sdk';

export function App() {
  const { provider, rpcClient, status, error, isReady } = useIris({
    rpcUrl: 'https://rpc.nockbox.org',
  });

  if (status === 'loading') return <div>Loading…</div>;
  if (status === 'error') return <pre>{String(error)}</pre>;
  if (!isReady) return null;

  return <div>Ready: {String(!!provider && !!rpcClient)}</div>;
}
```

Notes:

- `react` is a **peer dependency** (you bring your own React).
- The hook initializes WASM once per page load (safe for StrictMode/HMR).

## Development notes (this monorepo)

This SDK is built with `tsc` and publishes **compiled output** from `sdk/dist/`.

If you are iterating on `@nockchain/rose-wasm`, the recommended workflow is to publish it to a **local npm registry** (e.g. Verdaccio), then publish `@nockchain/sdk` against that version, and finally consume Rose using normal semver dependencies (no `file:`).
