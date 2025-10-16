/**
 * Sent Screen - Transaction confirmation after successful send
 */

import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';
import { CheckIcon } from '../../components/icons/CheckIcon';
import { ArrowUpRightIcon } from '../../components/icons/ArrowUpRightIcon';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export function SentScreen() {
  const { navigate, lastTransaction } = useStore();
  const { copied, copyToClipboard } = useCopyToClipboard();

  if (!lastTransaction) {
    // If no transaction data, redirect to home
    navigate('home');
    return null;
  }

  const { txid, amount, fee } = lastTransaction;
  const total = amount + fee;

  function handleViewDetails() {
    // TODO: Navigate to transaction details screen
    // For now, just navigate home
    navigate('home');
  }

  return (
    <ScreenContainer className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('home')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="text-xl font-semibold">Send NOCK</h2>
      </div>

      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckIcon className="w-12 h-12 text-green-500" />
        </div>
      </div>

      {/* Success message */}
      <h3 className="text-2xl font-semibold text-center mb-2">Sent!</h3>
      <p className="text-gray-400 text-center mb-8">
        Your transaction has been broadcast to the network
      </p>

      {/* Transaction details */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Amount</span>
          <span className="text-white font-mono">{amount} NOCK</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Fee</span>
          <span className="text-white font-mono">{fee} NOCK</span>
        </div>
        <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
          <span className="text-gray-400 text-sm">Total</span>
          <span className="text-white font-mono font-semibold">
            {total.toFixed(2)} NOCK
          </span>
        </div>
      </div>

      {/* Transaction ID */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-400 mb-2">Transaction ID:</p>
        <button
          onClick={() => copyToClipboard(txid)}
          className="w-full text-left"
        >
          <p className="text-sm font-mono break-all text-white mb-2">{txid}</p>
        </button>
        {copied && (
          <p className="text-xs text-green-500">Copied to clipboard!</p>
        )}
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2"
        >
          <ArrowUpRightIcon className="w-4 h-4" />
          View Details
        </button>
      </div>

      {/* Action button */}
      <button onClick={() => navigate('home')} className="btn-primary">
        View Details
      </button>
    </ScreenContainer>
  );
}
