/**
 * Transaction Approval Screen - Approve or reject transaction requests from dApps
 */

import { useStore } from "../../store";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ChevronLeftIcon } from "../../components/icons/ChevronLeftIcon";
import { Alert } from "../../components/Alert";
import { truncateAddress } from "../../utils/format";
import { send } from "../../utils/messaging";
import { INTERNAL_METHODS, NOCK_TO_NICKS } from "../../../shared/constants";
import { useAutoRejectOnClose } from "../../hooks/useAutoRejectOnClose";

export function TransactionApprovalScreen() {
  const {
    navigate,
    pendingTransactionRequest,
    setPendingTransactionRequest,
    wallet,
  } = useStore();

  if (!pendingTransactionRequest) {
    // No pending request, redirect to home
    navigate("home");
    return null;
  }

  const { id, origin, to, amount, fee } = pendingTransactionRequest;
  const currentAccount = wallet.currentAccount;

  // Convert nicks to NOCK for display
  const amountNock = (amount / NOCK_TO_NICKS).toFixed(4);
  const feeNock = (fee / NOCK_TO_NICKS).toFixed(4);
  const totalNock = ((amount + fee) / NOCK_TO_NICKS).toFixed(4);

  // Auto-reject when window closes without user action
  useAutoRejectOnClose(id, INTERNAL_METHODS.REJECT_TRANSACTION);

  async function handleReject() {
    try {
      await send(INTERNAL_METHODS.REJECT_TRANSACTION, [id]);
      setPendingTransactionRequest(null);
      window.close(); // Close approval popup
    } catch (error) {
      console.error("Failed to reject transaction:", error);
    }
  }

  async function handleApprove() {
    try {
      await send(INTERNAL_METHODS.APPROVE_TRANSACTION, [id]);
      setPendingTransactionRequest(null);
      window.close(); // Close approval popup
    } catch (error) {
      console.error("Failed to approve transaction:", error);
    }
  }

  return (
    <ScreenContainer className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleReject}
          className="transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Approve Transaction
        </h2>
      </div>

      {/* Site Origin */}
      <div className="mb-6">
        <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Requesting Site
        </label>
        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-surface-800)' }}>
          <p className="text-sm font-medium break-all" style={{ color: 'var(--color-text-primary)' }}>
            {origin}
          </p>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Recipient
          </label>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-surface-800)' }}>
            <p className="text-sm font-mono break-all" style={{ color: 'var(--color-text-primary)' }}>
              {to}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Amount
            </label>
            <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-surface-800)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {amountNock} NOCK
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {amount.toLocaleString()} nicks
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Fee
            </label>
            <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-surface-800)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {feeNock} NOCK
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {fee.toLocaleString()} nicks
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Total (Amount + Fee)
          </label>
          <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-surface-800)' }}>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {totalNock} NOCK
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {(amount + fee).toLocaleString()} nicks
            </p>
          </div>
        </div>
      </div>

      {/* Sending Account */}
      <div className="mb-6">
        <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          From Account
        </label>
        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-surface-800)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {currentAccount?.name || "Unknown"}
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {truncateAddress(currentAccount?.address)}
          </p>
        </div>
      </div>

      {/* Warning */}
      {/* <Alert type="warning" className="mb-6">
        Only approve transactions you understand from sites you trust. This transaction cannot be
        reversed once confirmed.
      </Alert> */}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <button onClick={handleReject} className="btn-secondary flex-1">
          Reject
        </button>
        <button onClick={handleApprove} className="btn-primary flex-1">
          Approve
        </button>
      </div>
    </ScreenContainer>
  );
}
