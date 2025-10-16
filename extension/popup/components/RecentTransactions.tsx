/**
 * RecentTransactions - Display recent transaction history
 */

import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';
import { ArrowDownLeftIcon } from './icons/ArrowDownLeftIcon';
import { Transaction } from '../../shared/types';
import { MOCK_TRANSACTIONS } from '../../shared/mocks/transactions';
import { truncateAddress, formatTimeAgo } from '../utils/format';

interface RecentTransactionsProps {
  onViewAll?: () => void;
}

export function RecentTransactions({ onViewAll }: RecentTransactionsProps) {
  // TODO: Get real transactions from blockchain when backend is ready
  const transactions: Transaction[] = MOCK_TRANSACTIONS;

  if (transactions.length === 0) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Recent Transactions</h3>
        </div>
        <div className="text-center py-8 text-gray-400 text-sm">
          No transactions yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-750 transition-colors"
          >
            {/* Transaction Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'sent'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-green-500/10 text-green-500'
              }`}
            >
              {tx.type === 'sent' ? (
                <ArrowUpRightIcon className="w-5 h-5" />
              ) : (
                <ArrowDownLeftIcon className="w-5 h-5" />
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">
                  {tx.type === 'sent' ? 'Sent' : 'Received'} {tx.amount} NOCK
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(tx.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 truncate">
                  From {truncateAddress(tx.address)}
                </span>
                {tx.status === 'pending' && (
                  <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
