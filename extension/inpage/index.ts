/**
 * Inpage Provider: Injected into web pages
 * Exposes window.nockchain with EIP-1193-style API
 */

import { MESSAGE_TARGETS } from '../shared/constants';

interface RequestArgs {
  method: string;
  params?: unknown[];
}

class NockProvider {
  /**
   * Make a request to the wallet
   * @param args - Request arguments with method and params
   */
  request(args: RequestArgs): Promise<unknown> {
    const id = Math.random().toString(36).slice(2);

    // Post message to content script
    window.postMessage(
      {
        target: MESSAGE_TARGETS.WALLET_BRIDGE,
        id,
        payload: args
      },
      '*'
    );

    // Wait for response
    return new Promise((resolve, reject) => {
      const handler = (evt: MessageEvent) => {
        const data = evt.data;

        // Check if this is our response
        if (data?.target === MESSAGE_TARGETS.WALLET_BRIDGE && data.id === id) {
          window.removeEventListener('message', handler);

          if (data.reply?.error) {
            reject(new Error(data.reply.error));
          } else {
            resolve(data.reply);
          }
        }
      };

      window.addEventListener('message', handler);
    });
  }

  /**
   * Event listener stub (for EIP-1193 compatibility)
   */
  on(_eventName: string, _listener: (...args: unknown[]) => void): void {
    // TODO: Implement event system if needed
  }

  /**
   * Remove event listener stub (for EIP-1193 compatibility)
   */
  removeListener(_eventName: string, _listener: (...args: unknown[]) => void): void {
    // TODO: Implement event system if needed
  }
}

// Inject provider into window
declare global {
  interface Window {
    nockchain: NockProvider;
  }
}

window.nockchain = new NockProvider();

// Announce provider availability
window.dispatchEvent(new Event('nockchain#initialized'));
