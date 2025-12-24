/**
 * Import Success Screen - Wallet imported successfully
 */

import { useStore } from '../../store';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import checkmarkSuccessIcon from '../../assets/checkmark-success-icon.svg';
import { InfoIcon } from '../../components/icons/InfoIcon';
import { send } from '../../utils/messaging';
import { useState, useEffect } from 'react';
import { INTERNAL_METHODS } from '../../../shared/constants';

export function ImportSuccessScreen() {
  const { navigate, wallet, goBack, fetchBalance } = useStore();
  const { copied, copyToClipboard } = useCopyToClipboard();
  const [isV0, setIsV0] = useState(false);
  useEffect(() => {
    (async () => {
            const res = await send<{ ok?: boolean; has?: boolean; error?: unknown }>(
                INTERNAL_METHODS.HAS_V0_MNEMONIC,
                []
            );
            if (res?.ok) {
                setIsV0(Boolean(res.has));
            }
    })();
}, []);
  // Format address to show start and end with middle grayed out
  function formatAddress(address: string) {
    if (!address || address.length < 20) return address;
    const start = address.slice(0, 6);
    const middle = address.slice(6, -5);
    const end = address.slice(-5);
    return { start, middle, end };
  }

  const formattedAddress = formatAddress(wallet.address || '');

  function handleStartUsing() {
    // Start fetching balance in background (non-blocking)
    fetchBalance();
    // Navigate immediately - HomeScreen will show loading state
    navigate('home');
  }

  return (
    <div className="relative w-[357px] h-[600px] bg-[var(--color-bg)]">
      {/* Header with back button */}
      <div className="flex items-center justify-between h-16 px-4 py-3 border-b border-[var(--color-divider)]">
        <button
          onClick={goBack}
          className="p-2 -ml-2 hover:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="var(--color-text-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2
          className="font-sans font-medium text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-normal)',
            letterSpacing: '0.01em',
          }}
        >
          Wallet imported
        </h2>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Main content */}
      <div className="flex flex-col justify-between h-[536px]">
        <div className="px-4 py-2 flex flex-col gap-8">
          {/* Icon and heading */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10">
              <img src={checkmarkSuccessIcon} alt="" className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-2 items-center text-center w-full">
              <h1
                className="font-serif font-medium text-[var(--color-text-primary)]"
                style={{
                  fontSize: 'var(--font-size-xl)',
                  lineHeight: 'var(--line-height-relaxed)',
                  letterSpacing: '-0.02em',
                }}
              >
                {isV0 ? 'Wallet (v0) imported successfully!' : 'Wallet imported successfully!'}
              </h1>
              <p
                className="font-sans text-[var(--color-text-muted)]"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 'var(--line-height-snug)',
                  letterSpacing: '0.02em',
                }}
              >
                {isV0 ? 'A new v1 wallet has been created for you. You can use the upgrade tool to move your v0 notes.' : 'Your wallet is ready to use'}
              </p>
            </div>
          </div>

          {/* Address section */}
          <div className="flex flex-col gap-1.5 w-full">
            <p
              className="font-sans font-medium text-center text-[var(--color-text-primary)]"
              style={{
                fontSize: 'var(--font-size-sm)',
                lineHeight: 'var(--line-height-snug)',
                letterSpacing: '0.02em',
              }}
            >
              {isV0 ? 'Your NEW v1 address' : 'Your address'}
            </p>
            <div className="bg-[var(--color-surface-900)] rounded-lg p-3 flex flex-col gap-5 items-center">
              {/* Address display */}
              <p
                className="font-sans font-medium text-center text-[var(--color-text-primary)] break-words w-full"
                style={{
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-snug)',
                  letterSpacing: '0.01em',
                }}
              >
                {typeof formattedAddress === 'string' ? (
                  formattedAddress
                ) : (
                  <>
                    {formattedAddress.start}
                    <span className="text-[var(--color-text-muted)]">
                      {formattedAddress.middle}
                    </span>
                    {formattedAddress.end}
                  </>
                )}
              </p>

              {/* Copy button */}
              <button
                onClick={() => copyToClipboard(wallet.address || '')}
                className="border border-[var(--color-text-primary)] rounded-full px-4 py-1.5 flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4V2.66667C4 2.29848 4.29848 2 4.66667 2H13.3333C13.7015 2 14 2.29848 14 2.66667V11.3333C14 11.7015 13.7015 12 13.3333 12H12"
                    stroke="var(--color-text-primary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="2"
                    y="4"
                    width="10"
                    height="10"
                    rx="0.666667"
                    stroke="var(--color-text-primary)"
                    strokeWidth="1.5"
                  />
                </svg>
                <span
                  className="font-sans font-medium text-[var(--color-text-primary)]"
                  style={{
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-snug)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {copied ? 'Copied!' : 'Copy address'}
                </span>
              </button>

              {isV0 && (
                <div
                  className="flex items-start gap-2 p-3 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-surface-800)',
                    border: '1px solid var(--color-surface-700)',
                  }}
                >
                  <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5 m-auto" />
                  <div className="flex-1">
                    <p
                      className="font-sans text-center text-[var(--color-text-muted)]"
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        lineHeight: 'var(--line-height-snug)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Hint: Use the upgrade tool to move your v0 notes.<br />
                      <a
                        href="https://nocknames.com/upgrade"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-70 text-[#37f] font-bold"
                      >
                        nocknames.com/upgrade
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom button */}
        <div className="border-t border-[var(--color-surface-800)] p-3">
          <button
            onClick={handleStartUsing}
            className="w-full h-12 px-5 py-[15px] btn-primary text-[#000000] rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 500,
              lineHeight: 'var(--line-height-snug)',
              letterSpacing: '0.01em',
            }}
          >
            Start using wallet
          </button>
        </div>
      </div>
    </div>
  );
}
