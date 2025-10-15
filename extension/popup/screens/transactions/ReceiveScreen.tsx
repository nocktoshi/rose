/**
 * Receive Screen - Display address for receiving NOCK
 */

import { useState } from 'react';
import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';

export function ReceiveScreen() {
  const { navigate, wallet } = useStore();
  const [copied, setCopied] = useState(false);

  const address = wallet.currentAccount?.address || '';

  async function handleCopyAddress() {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  }

  return (
    <ScreenContainer className="flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('home')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold">Receive NOCK</h2>
      </div>

      {/* Address section */}
      <div className="mb-6">
        <h3 className="text-center text-gray-300 mb-4">Your Address</h3>
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm font-mono break-all text-gray-200">{address}</p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopyAddress}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {copied ? 'Copied!' : 'Copy Address'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold mb-2">How to receive NOCK:</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Share this address with the sender</li>
          <li>• Transactions will appear in your wallet</li>
        </ul>
      </div>

      {/* Done button */}
      <button
        onClick={() => navigate('home')}
        className="w-full btn-secondary mt-auto"
      >
        Done
      </button>
    </ScreenContainer>
  );
}
