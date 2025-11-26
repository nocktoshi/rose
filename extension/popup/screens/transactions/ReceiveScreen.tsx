/**
 * Receive Screen - Display address for receiving NOCK
 */

import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';
import { CopyIcon } from '../../components/icons/CopyIcon';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export function ReceiveScreen() {
  const { navigate, wallet } = useStore();
  const { copied, copyToClipboard } = useCopyToClipboard();

  const address = wallet.currentAccount?.address || '';

  return (
    <ScreenContainer className="flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('home')}
          className="transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Receive NOCK
        </h2>
      </div>

      {/* Address section */}
      <div className="mb-6">
        <h3 className="text-center mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Your Address
        </h3>
        <div
          className="rounded-lg p-4 mb-4"
          style={{ backgroundColor: 'var(--color-surface-800)' }}
        >
          <p className="text-sm font-mono break-all" style={{ color: 'var(--color-text-primary)' }}>
            {address}
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={() => copyToClipboard(address)}
          className="w-full font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#000',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <CopyIcon />
          {copied ? 'Copied!' : 'Copy Address'}
        </button>
      </div>

      {/* Instructions */}
      <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--color-surface-900)' }}>
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          How to receive NOCK:
        </h4>
        <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-muted)' }}>
          <li>• Share this address with the sender</li>
          <li>• Transactions will appear in your wallet</li>
        </ul>
      </div>

      {/* Done button */}
      <button onClick={() => navigate('home')} className="w-full btn-secondary mt-auto">
        Done
      </button>
    </ScreenContainer>
  );
}
