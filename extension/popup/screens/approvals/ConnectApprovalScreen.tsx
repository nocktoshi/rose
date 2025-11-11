/**
 * Connect Approval Screen - Approve or reject connection requests from dApps
 */

import { useStore } from "../../store";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ChevronLeftIcon } from "../../components/icons/ChevronLeftIcon";
import { truncateAddress } from "../../utils/format";
import { send } from "../../utils/messaging";
import { INTERNAL_METHODS } from "../../../shared/constants";
import { useAutoRejectOnClose } from "../../hooks/useAutoRejectOnClose";

export function ConnectApprovalScreen() {
  const { navigate, pendingConnectRequest, setPendingConnectRequest, wallet } =
    useStore();

  if (!pendingConnectRequest) {
    // No pending request, redirect to home
    navigate("home");
    return null;
  }

  const { id, origin } = pendingConnectRequest;
  const currentAccount = wallet.currentAccount;

  // Auto-reject when window closes without user action
  useAutoRejectOnClose(id, INTERNAL_METHODS.REJECT_CONNECTION);

  async function handleReject() {
    try {
      await send(INTERNAL_METHODS.REJECT_CONNECTION, [id]);
      setPendingConnectRequest(null);
      window.close(); // Close approval popup
    } catch (error) {
      console.error("Failed to reject connection:", error);
    }
  }

  async function handleConnect() {
    try {
      await send(INTERNAL_METHODS.APPROVE_CONNECTION, [id]);
      setPendingConnectRequest(null);
      window.close(); // Close approval popup
    } catch (error) {
      console.error("Failed to approve connection:", error);
    }
  }

  // Extract domain from origin for cleaner display
  const domain = (() => {
    try {
      return new URL(origin).hostname;
    } catch {
      return origin;
    }
  })();

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
          Connect Request
        </h2>
      </div>

      {/* Site Info */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4">
          <span className="text-2xl font-bold text-white">
            {domain.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {domain}
        </h3>
        <p className="text-sm break-all" style={{ color: 'var(--color-text-muted)' }}>
          {origin}
        </p>
      </div>

      {/* Permission Info */}
      <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: 'var(--color-surface-800)' }}>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-primary)' }}>
          This site is requesting permission to:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-primary)' }}>
            <span className="mt-0.5" style={{ color: 'var(--color-green)' }}>✓</span>
            <span>View your wallet address</span>
          </li>
          <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-primary)' }}>
            <span className="mt-0.5" style={{ color: 'var(--color-green)' }}>✓</span>
            <span>Request approval for transactions</span>
          </li>
        </ul>
      </div>

      {/* Account Info */}
      <div className="mb-6">
        <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Connecting Account
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

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <button onClick={handleReject} className="btn-secondary flex-1">
          Cancel
        </button>
        <button onClick={handleConnect} className="btn-primary flex-1">
          Connect
        </button>
      </div>
    </ScreenContainer>
  );
}
