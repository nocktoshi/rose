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
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="text-xl font-semibold">Approve Transaction</h2>
      </div>

      {/* Site Origin */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 block mb-2">
          Requesting Site
        </label>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm font-medium break-all">{origin}</p>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="text-sm text-gray-400 block mb-2">Recipient</label>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-sm font-mono break-all">{to}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Amount</label>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-sm font-medium">{amountNock} NOCK</p>
              <p className="text-xs text-gray-500 mt-1">
                {amount.toLocaleString()} nicks
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Fee</label>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-sm font-medium">{feeNock} NOCK</p>
              <p className="text-xs text-gray-500 mt-1">
                {fee.toLocaleString()} nicks
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-2">
            Total (Amount + Fee)
          </label>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-lg font-semibold">{totalNock} NOCK</p>
            <p className="text-xs text-gray-500 mt-1">
              {(amount + fee).toLocaleString()} nicks
            </p>
          </div>
        </div>
      </div>

      {/* Sending Account */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 block mb-2">From Account</label>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm font-medium">
            {currentAccount?.name || "Unknown"}
          </p>
          <p className="text-xs text-gray-500 font-mono mt-1">
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
