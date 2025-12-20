# `@nockbox/iris-sdk`

TypeScript SDK for interacting with the **Iris** browser wallet extension (Nockchain).

## Install

```bash
npm i @nockbox/iris-sdk
```

## What you get

- **`NockchainProvider`**: connect to Iris and request signatures / transactions (EIP-1193-ish API).
- **`TransactionBuilder`**: small fluent helper for constructing the simple “send transaction” payload.
- **WASM re-exports**: convenience re-export of `@nockbox/iris-wasm` under `@nockbox/iris-sdk/wasm`.
- **React Hook**: `useIris()` for one-time WASM init + gRPC client + provider wiring.

## Basic usage (provider)

```ts
import { NockchainProvider } from '@nockbox/iris-sdk';

const provider = new NockchainProvider();
const { pkh, grpcEndpoint } = await provider.connect();

const sig = await provider.signMessage('hello');
console.log(sig.signature, sig.publicKeyHex);
```

## Building a simple transaction payload

```ts
import { NockchainProvider, TransactionBuilder } from '@nockbox/iris-sdk';

const provider = new NockchainProvider();
await provider.connect();

const tx = new TransactionBuilder().to('...recipient_pkh...').amount(1_000_000).build();
const txId = await provider.sendTransaction(tx);
```

## WASM / raw transaction signing

If you’re using `@nockbox/iris-wasm` types like `TxBuilder`, import them via the SDK’s subpath:

```ts
import {
  TxBuilder,
  Pkh,
  SpendCondition,
  Digest,
  GrpcClient,
  RawTx,
  Note,
} from '@nockbox/iris-sdk/wasm';
import { NockchainProvider } from '@nockbox/iris-sdk';
```

The SDK also exposes a namespace export:

```ts
import { wasm } from '@nockbox/iris-sdk';
// wasm.TxBuilder, wasm.Pkh, ...
```

See `sdk/examples/` for an end-to-end example of building + signing a raw transaction.

## React: `useIris` hook

```tsx
import { useIris } from '@nockbox/iris-sdk';

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

If you are iterating on `@nockbox/iris-wasm`, the recommended workflow is to publish it to a **local npm registry** (e.g. Verdaccio), then publish `@nockbox/iris-sdk` against that version, and finally consume Iris using normal semver dependencies (no `file:`).
