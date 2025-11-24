import React from 'react';
import { useStore } from '../store';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import IrisLogo40 from '../assets/iris-logo-40.svg';
import { truncateAddress, formatUTCTimestamp } from '../utils/format';
import { REQUIRED_CONFIRMATIONS } from '../../shared/constants';

export function TransactionDetailsScreen() {
  const {
    navigate,
    selectedTransaction,
    wallet,
    priceUsd,
    fetchCachedTransactions,
    cachedTransactions,
    setSelectedTransaction,
  } = useStore();

  // Fetch fresh transaction data on mount
  React.useEffect(() => {
    console.log('[TxDetails] Screen mounted, fetching latest transaction data');
    fetchCachedTransactions();
  }, []);

  // Sync selectedTransaction with updates from cachedTransactions
  React.useEffect(() => {
    if (!selectedTransaction) return;

    // Find the updated transaction in cachedTransactions by txid
    const updatedTx = cachedTransactions.find(tx => tx.txid === selectedTransaction.txid);
    if (updatedTx) {
      console.log('[TxDetails] Syncing selectedTransaction with cached data', {
        oldConfirmations: selectedTransaction.confirmations,
        newConfirmations: updatedTx.confirmations,
      });
      // Update selectedTransaction with the latest data
      setSelectedTransaction(updatedTx);
    }
  }, [cachedTransactions, selectedTransaction?.txid]);

  // Note: Transaction confirmation polling is handled globally by Popup.tsx
  // The sync effect above ensures this screen always shows the latest data

  // If no transaction selected, show error state
  if (!selectedTransaction) {
    return (
      <div
        className="w-[357px] h-[600px] flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>
          <p>No transaction selected</p>
          <button
            onClick={() => navigate('home')}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Extract data from selected transaction
  const transactionType = selectedTransaction.type === 'sent' ? 'sent' : 'received';
  const amount = selectedTransaction.amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const usdValue = `$${(selectedTransaction.amount * priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Determine status display with confirmation progress
  let statusText: string;
  let statusColor: string;

  if (selectedTransaction.status === 'failed') {
    statusText = 'Failed';
    statusColor = 'var(--color-red)';
  } else if (selectedTransaction.status === 'pending') {
    statusText = `Pending (0/${REQUIRED_CONFIRMATIONS})`;
    statusColor = '#C88414';
  } else if (selectedTransaction.status === 'confirmed') {
    const confirmations = selectedTransaction.confirmations ?? 0;
    if (confirmations < REQUIRED_CONFIRMATIONS) {
      statusText = `Confirming (${confirmations}/${REQUIRED_CONFIRMATIONS})`;
      statusColor = '#C88414';
    } else {
      statusText = 'Confirmed';
      statusColor = 'var(--color-green)';
    }
  } else {
    statusText = 'Unknown';
    statusColor = 'var(--color-text-muted)';
  }

  const currentAddress = wallet.currentAccount?.address || '';
  const fromAddress =
    selectedTransaction.type === 'sent'
      ? truncateAddress(currentAddress)
      : truncateAddress(selectedTransaction.address);
  const toAddress =
    selectedTransaction.type === 'sent'
      ? truncateAddress(selectedTransaction.address)
      : truncateAddress(currentAddress);

  const networkFee = `${selectedTransaction.fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NOCK`;
  const totalNock =
    selectedTransaction.type === 'sent'
      ? selectedTransaction.amount + selectedTransaction.fee
      : selectedTransaction.amount;
  const total = `${totalNock.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NOCK`;
  const totalUsd = `$${(totalNock * priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const transactionId = selectedTransaction.txid;
  const transactionTimeUTC = formatUTCTimestamp(selectedTransaction.timestamp);

  function handleBack() {
    navigate('home');
  }
  function handleViewExplorer() {
    // Open transaction on nockscan.net
    window.open(`https://nockscan.net/tx/${transactionId}`, '_blank');
  }
  function handleCopyTransactionId() {
    navigator.clipboard.writeText(transactionId);
    // TODO: Show a toast notification that it was copied
  }

  return (
    <div
      className="w-[357px] h-[600px] flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 min-h-[64px]"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <button
          type="button"
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center p-2 rounded-lg transition-opacity focus:outline-none focus-visible:ring-2"
          style={{ color: 'var(--color-text-primary)' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          aria-label="Back"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="m-0 text-base font-medium leading-[22px] tracking-[0.16px]">
          {transactionType === 'sent' ? 'Sent' : 'Received'}
        </h1>
        <div className="w-8 h-8" />
      </header>

      {/* Content */}
      <div
        className="flex flex-col gap-2 h-[536px] overflow-y-auto"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className="flex flex-col gap-8 px-4 py-2">
          {/* Amount Section */}
          <div className="flex flex-col items-center gap-3">
            <img src={IrisLogo40} alt="Iris" className="w-10 h-10" />
            <div className="flex flex-col items-center gap-0.5 text-center">
              <h2
                className="m-0 font-[Lora] text-[36px] font-semibold leading-10 tracking-[-0.72px]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {transactionType === 'sent' && '-'}
                {amount} <span style={{ color: 'var(--color-text-muted)' }}>NOCK</span>
              </h2>
              <p
                className="m-0 text-[13px] font-medium leading-[18px] tracking-[0.26px]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {usdValue}
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="flex flex-col gap-2">
            {/* Status */}
            <div
              className="rounded-lg px-3 py-5"
              style={{ backgroundColor: 'var(--color-surface-800)' }}
            >
              <div className="flex items-center justify-between text-sm font-medium leading-[18px] tracking-[0.14px]">
                <div style={{ color: 'var(--color-text-primary)' }}>Status</div>
                <div style={{ color: statusColor }}>
                  <span className="whitespace-nowrap">{statusText}</span>
                </div>
              </div>
            </div>

            {/* Transaction Time */}
            <div
              className="rounded-lg px-3 py-5"
              style={{ backgroundColor: 'var(--color-surface-800)' }}
            >
              <div className="flex items-center justify-between text-sm font-medium leading-[18px] tracking-[0.14px]">
                <div style={{ color: 'var(--color-text-primary)' }}>Time</div>
                <div
                  className="text-right text-[13px] leading-[18px] tracking-[0.26px]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {transactionTimeUTC}
                </div>
              </div>
            </div>

            {/* From / To */}
            <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-surface-800)' }}>
              <div className="flex items-center gap-2.5">
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="text-sm font-medium leading-[18px] tracking-[0.14px]">From</div>
                  <div
                    className="text-[13px] leading-[18px] tracking-[0.26px] truncate"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {fromAddress}
                  </div>
                </div>
                <div className="p-1 shrink-0">
                  <ChevronRightIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="text-sm font-medium leading-[18px] tracking-[0.14px]">To</div>
                  <div
                    className="text-[13px] leading-[18px] tracking-[0.26px] truncate"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {toAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* Fee and Total */}
            <div
              className="rounded-lg px-3 py-3 flex flex-col gap-3"
              style={{ backgroundColor: 'var(--color-surface-800)' }}
            >
              <div className="flex items-center justify-between text-sm font-medium leading-[18px] tracking-[0.14px]">
                <div style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>Network fee</div>
                <div className="whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                  {networkFee}
                </div>
              </div>
              <div className="h-px w-full" style={{ backgroundColor: 'var(--color-divider)' }} />
              <div className="flex items-center justify-between text-sm font-medium leading-[18px] tracking-[0.14px]">
                <div style={{ color: 'var(--color-text-primary)' }}>Total</div>
                <div className="flex flex-col items-end gap-1 w-[75px]">
                  <div className="whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                    {total}
                  </div>
                  <div
                    className="text-[13px] leading-[18px] tracking-[0.26px] whitespace-nowrap"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {totalUsd}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleViewExplorer}
                className="flex-1 py-[7px] px-3 bg-transparent rounded-full text-sm font-medium leading-[18px] tracking-[0.14px] transition-colors focus:outline-none focus-visible:ring-2 whitespace-nowrap"
                style={{
                  border: '1px solid var(--color-surface-700)',
                  color: 'var(--color-text-primary)',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-surface-800)')
                }
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                View on explorer
              </button>
              <button
                type="button"
                onClick={handleCopyTransactionId}
                className="flex-1 py-[7px] px-3 bg-transparent rounded-full text-sm font-medium leading-[18px] tracking-[0.14px] transition-colors focus:outline-none focus-visible:ring-2 whitespace-nowrap"
                style={{
                  border: '1px solid var(--color-surface-700)',
                  color: 'var(--color-text-primary)',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = 'var(--color-surface-800)')
                }
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Copy transaction ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
