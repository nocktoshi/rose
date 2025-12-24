/**
 * Inpage Provider: Injected into web pages
 * Implements EIP-6963 Multi Injected Provider Discovery
 * and EIP-1193 Provider API
 *
 * NOTE: This file runs in the MAIN world and cannot use any imports or Chrome APIs
 */

import { InjectedNockchain, RpcRequest } from '@nockchain/sdk';
import { version } from '../../package.json';

// Inline constant to avoid imports
const MESSAGE_TARGET = 'ROSE';

// EIP-6963 types (inline to avoid circular dependencies)
interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: InjectedNockchain;
}

// EIP-6963 Provider Info for Rose Wallet
const PROVIDER_INFO: EIP6963ProviderInfo = {
  uuid: '350670db-19fa-4704-a166-e52e178b59d2',
  name: 'Rose',
  icon: 'data:image/svg+xml,%3Csvg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2120 2120" width="96" height="96"%3E%3Cstyle%3E.s0%7Bfill:%23ec1e24%7D.s1%7Bfill:%23e51d25%7D.s2%7Bfill:%230f8945%7D.s3%7Bfill:%230a7e40%7D%3C/style%3E%3Cg id="Layer 1"%3E%3Cg%3E%3Cpath class="s0" d="m1141.12 574.61l-85.01 53.22c-20.3 10.36-40.1 22.84-60.16 30.45-49.08 18.59-96.03 40.49-147.89 59.18-54.93 18.09-54.19 13.65-66.34 49.66-6.4 17.8-18.35 39.63-17.9 58.38-12.06 66.85-20.4 114.97 3.28 189.1 2.69 8.89 3.96 14.2 8.36 19.43 2.58 6.12 7.4 14.5 10.07 19.59l14.59 23.44c4.02 5.55 3.11 4.08 6.38 10.26 2.99 5.45 4.22 7.29 8.61 12.53 25.19 33.02 7.94 56.12 129.82 68.81 61.46 6.39 80.86 6.35 136.09-7.21 8.64-3.75 15.56-7.65 25.89-10.91 9.99-3.29 16.25-7.59 25.64-11.97 40.4-18.31 72.77-51.87 100.64-85.47 22.49-27.49 69.69-96.14 83.16-127.53 3.94-9.36 3.95-13.51 8.57-22.81 40.75-82.03 73.22-220.2 71.51-315.97-0.38-35.37-1.11-62.81-4.49-95.67-1.3-12.93-4.7-29.51-7.89-44.68l-0.38-3.5q-0.68-4.22-1.53-6.37c-1.46-7.06-9.65-40.34-7.8-45.72-1.49-6.71-0.26-20.81-16.5-9.4-9.48 5.41-71.09 72.45-90.28 89.84-45.75 40.01-84.95 68.47-126.44 103.32z"/%3E%3Cpath class="s2" d="m1113.77 1171.23l-24.83 10.66c-1.68 19.26 8.4 22.9 21.15 31.64 3.26 2.36 33.95 19.93 36.3 20.83 11.39 4.45 37.71 8.48 51.06 10.33 38.19-0.83 113.88 1.25 147.03 10.38 3.38 0.98 29.68 13.32 32.28 15.28 3.29 2.02 17.7 19.56 30.35 9.57 17.75-48.69-51.06-113.92-76.47-132.42-36.48-26.73-82.55-54.65-107.35-44.34-14.36 5.68-76.04 53.67-109.52 68.07z"/%3E%3Cpath class="s3" d="m985.44 1204.75q31.91-2.42 63.82-4.83c152.67 562.41-158.23 1208.49-279.97 1584.18-47.44-16.26-63.24-21.79-110.67-38.04 147.3-327.05 482.61-955.06 326.82-1541.31z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E',
  rdns: 'net.nockchain.rose',
};

class NockchainProvider implements InjectedNockchain {
  name: string = 'rose';
  version: string = version;

  /**
   * Make a request to the wallet (EIP-1193 compatible)
   * @param args - Request arguments with method and params
   */
  request<T = unknown>(args: RpcRequest): Promise<T> {
    const id = Math.random().toString(36).slice(2);

    // Post message to content script
    window.postMessage(
      {
        target: MESSAGE_TARGET,
        id,
        payload: args,
      },
      '*'
    );

    // Wait for response with timeout
    return new Promise((resolve, reject) => {
      let timeoutId: number | undefined;

      const handler = (evt: MessageEvent) => {
        const data = evt.data;

        // Check if this is our response (must have a reply field, not just the request)
        if (data?.target === MESSAGE_TARGET && data.id === id && data.reply !== undefined) {
          window.removeEventListener('message', handler);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (data.reply?.error) {
            reject(new Error(data.reply.error));
          } else {
            resolve(data.reply);
          }
        }
      };

      if (args.timeout) {
        timeoutId = window.setTimeout(() => {
          window.removeEventListener('message', handler);
          reject(
            new Error(
              'Extension is not responding.' +
                'If you just reloaded the extension, you need to refresh this page.'
            )
          );
        }, args.timeout);
      }
      window.addEventListener('message', handler);
    });
  }
}

// Create the provider instance
const provider = new NockchainProvider();

// Freeze the provider to prevent tampering (EIP-6963 recommendation)
Object.freeze(provider);

/**
 * Announce the Rose provider using EIP-6963 events
 */
function announceProvider() {
  const detail: EIP6963ProviderDetail = Object.freeze({
    info: PROVIDER_INFO,
    provider: provider,
  });

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail,
    })
  );
}

// Announce immediately on load
announceProvider();

// Listen for provider requests and re-announce (EIP-6963 pattern)
window.addEventListener('eip6963:requestProvider', () => {
  announceProvider();
});
