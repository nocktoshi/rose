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
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="text-xl font-semibold">Sign Message</h2>
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

      {/* Message Content */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 block mb-2">Message</label>
        <div className="bg-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto">
          <pre className="text-sm whitespace-pre-wrap break-words font-mono">
            {message}
          </pre>
        </div>
      </div>

      {/* Account Info */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 block mb-2">
          Signing Account
        </label>
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
