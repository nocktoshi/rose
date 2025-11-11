/**
 * Sign Message Screen - Approve or reject message signing requests from dApps
 */

import { useStore } from "../../store";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ChevronLeftIcon } from "../../components/icons/ChevronLeftIcon";
import { Alert } from "../../components/Alert";
import { truncateAddress } from "../../utils/format";
import { send } from "../../utils/messaging";
import { INTERNAL_METHODS } from "../../../shared/constants";
import { useAutoRejectOnClose } from "../../hooks/useAutoRejectOnClose";

export function SignMessageScreen() {
  const { navigate, pendingSignRequest, setPendingSignRequest, wallet } =
    useStore();

  if (!pendingSignRequest) {
    // No pending request, redirect to home
    navigate("home");
    return null;
  }

  const { id, origin, message } = pendingSignRequest;
  const currentAccount = wallet.currentAccount;

  // Auto-reject when window closes without user action
  useAutoRejectOnClose(id, INTERNAL_METHODS.REJECT_SIGN_MESSAGE);

  async function handleDecline() {
    try {
      await send(INTERNAL_METHODS.REJECT_SIGN_MESSAGE, [id]);
      setPendingSignRequest(null);
      window.close(); // Close approval popup
    } catch (error) {
      console.error("Failed to reject sign message:", error);
    }
  }

  async function handleSign() {
    try {
      await send(INTERNAL_METHODS.APPROVE_SIGN_MESSAGE, [id]);
      setPendingSignRequest(null);
      window.close(); // Close approval popup
    } catch (error) {
      console.error("Failed to approve sign message:", error);
    }
  }

  return (
    <ScreenContainer className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleDecline}
          className="transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Sign Message
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

      {/* Message Content */}
      <div className="mb-6">
        <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Message
        </label>
        <div className="rounded-lg p-4 max-h-48 overflow-y-auto" style={{ backgroundColor: 'var(--color-surface-800)' }}>
          <pre className="text-sm whitespace-pre-wrap break-words font-mono" style={{ color: 'var(--color-text-primary)' }}>
            {message}
          </pre>
        </div>
      </div>

      {/* Account Info */}
      <div className="mb-6">
        <label className="text-sm block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Signing Account
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
        Only sign messages you understand from sites you trust. Your signature can be used to
        authorize actions on your behalf.
      </Alert> */}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <button onClick={handleDecline} className="btn-secondary flex-1">
          Decline
        </button>
        <button onClick={handleSign} className="btn-primary flex-1">
          Sign
        </button>
      </div>
    </ScreenContainer>
  );
}
