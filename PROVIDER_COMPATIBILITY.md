# Provider Compatibility Guide

Rose wallet implements [EIP-6963: Multi Injected Provider Discovery](https://eips.ethereum.org/EIPS/eip-6963) for multi-wallet support.

## Quick Start

```typescript
import { NockchainProvider } from '@nockchain/sdk';

// Simple approach
const nockchain = new NockchainProvider();
await nockchain.connect();

// Wait for provider (recommended)
const found = await NockchainProvider.waitForInstallation(3000);
if (found) {
  const nockchain = new NockchainProvider();
  await nockchain.connect();
}
```

## How It Works

Rose uses **EIP-6963 events** instead of global namespaces:

1. Rose announces itself via `eip6963:announceProvider` event
2. dApps request providers via `eip6963:requestProvider` event
3. No `window.nockchain` pollution - pure event-based discovery

**Benefits:**

- ✅ No race conditions or namespace collisions
- ✅ Multiple wallets coexist peacefully
- ✅ Industry standard (Ethereum EIP-6963)

## Discovery Methods

```typescript
// Check if installed (synchronous)
if (NockchainProvider.isInstalled()) {
  const nockchain = new NockchainProvider();
}

// Wait for provider (async, handles race conditions)
const found = await NockchainProvider.waitForInstallation(3000);

// Discover all providers
const providers = NockchainProvider.discoverProviders();
providers.forEach(({ info, provider }) => {
  console.log(info.name, info.rdns);
});
```

## Manual Event Listening

```typescript
window.addEventListener('eip6963:announceProvider', event => {
  const { info, provider } = event.detail;
  if (info.rdns === 'net.nockchain.rose') {
    // Use Rose provider
  }
});

window.dispatchEvent(new Event('eip6963:requestProvider'));
```

## Building a Wallet Extension

```typescript
// Your inpage script
class YourProvider {
  request(args) {
    /* EIP-1193 implementation */
  }
}

const provider = new YourProvider();
Object.freeze(provider);

const info = {
  uuid: crypto.randomUUID(),
  name: 'Your Wallet',
  icon: 'data:image/svg+xml,...', // 96x96px
  rdns: 'com.example.wallet',
};

function announceProvider() {
  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info, provider }),
    })
  );
}

announceProvider();
window.addEventListener('eip6963:requestProvider', announceProvider);
```

## Complete Example

```typescript
import { NockchainProvider, WalletNotInstalledError } from '@nockchain/sdk';

async function connectWallet() {
  try {
    const found = await NockchainProvider.waitForInstallation(3000);
    if (!found) {
      alert('Please install Rose wallet');
      return;
    }

    const nockchain = new NockchainProvider();
    const { pkh } = await nockchain.connect();

    const tx = nockchain.transaction().to('recipient_address').amount(1_000_000).build();

    const txId = await nockchain.sendTransaction(tx);
    console.log('Transaction sent:', txId);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

## Troubleshooting

**Provider not found?**

- Ensure Rose extension is installed and enabled
- Refresh the page after installing/reloading extension
- Use `waitForInstallation()` for race conditions

**After extension reload:**

- Always refresh the dApp page
- Inpage script only injects once per page load

## Resources

- [EIP-6963 Specification](https://eips.ethereum.org/EIPS/eip-6963)
- [Nockchain Documentation](https://nockchain.org)
