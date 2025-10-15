/**
 * Messaging utilities for communicating with the service worker
 */

// Note - Extension has separate isolated contexts which cannot directly call each other's functions.
// Must use Chrome's message passing API to communicate between popup, content scripts, and background service worker.

/**
 * Send a message to the service worker
 * @param method - The method to call (from INTERNAL_METHODS or PROVIDER_METHODS)
 * @param params - Optional parameters to pass
 * @returns Promise with the response from the service worker
 */
export function send<T = unknown>(method: string, params?: unknown[]): Promise<T> {
  return chrome.runtime.sendMessage({ payload: { method, params } });
}
