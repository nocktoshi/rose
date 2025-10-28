/**
 * Service Worker: Wallet controller and message router
 * Handles provider requests from content script and popup UI
 */

import { Vault } from "../shared/vault";
import { isNockAddress } from "../shared/validators";
import {
  PROVIDER_METHODS,
  INTERNAL_METHODS,
  ERROR_CODES,
  ALARM_NAMES,
  AUTOLOCK_MINUTES,
  STORAGE_KEYS,
  USER_ACTIVITY_METHODS,
  DEFAULT_TRANSACTION_FEE,
  UI_CONSTANTS,
  APPROVAL_CONSTANTS,
} from "../shared/constants";
import type { TransactionRequest, SignRequest } from "../shared/types";

const vault = new Vault();
let lastActivity = Date.now();
let autoLockMinutes = AUTOLOCK_MINUTES;

/**
 * Pending approval requests
 * Maps request ID to the request data and response callback
 */
interface PendingRequest {
  request: TransactionRequest | SignRequest;
  sendResponse: (response: any) => void;
  origin: string;
}

const pendingRequests = new Map<string, PendingRequest>();

/**
 * Create an approval popup window
 */
async function createApprovalPopup(requestId: string, type: 'transaction' | 'sign-message') {
  const hashPrefix = type === 'transaction'
    ? APPROVAL_CONSTANTS.TRANSACTION_HASH_PREFIX
    : APPROVAL_CONSTANTS.SIGN_MESSAGE_HASH_PREFIX;
  const popupUrl = chrome.runtime.getURL(`popup/index.html#${hashPrefix}${requestId}`);

  // Get the last focused window to position the popup relative to it
  const currentWindow = await chrome.windows.getLastFocused();

  // Calculate position for top-right area
  const width = UI_CONSTANTS.POPUP_WIDTH;
  const height = UI_CONSTANTS.POPUP_HEIGHT;

  // Position in top-right of the current window, with some padding
  // If window dimensions aren't available, use reasonable defaults
  const left = currentWindow.left !== undefined && currentWindow.width !== undefined
    ? currentWindow.left + currentWindow.width - width - UI_CONSTANTS.POPUP_RIGHT_OFFSET
    : undefined; // Let Chrome position it
  const top = currentWindow.top !== undefined
    ? currentWindow.top + UI_CONSTANTS.POPUP_TOP_OFFSET
    : undefined; // Let Chrome position it

  await chrome.windows.create({
    url: popupUrl,
    type: 'popup',
    width,
    height,
    left,
    top,
    focused: true,
  });
}

/**
 * Emit a wallet event to all tabs
 * This notifies dApps of wallet state changes (account switches, network changes, etc.)
 */
async function emitWalletEvent(eventType: string, data: unknown) {
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'WALLET_EVENT',
          eventType,
          data,
        });
      } catch (error) {
        // Tab might not have content script, ignore
      }
    }
  }
}

// Initialize auto-lock setting and schedule alarm
(async () => {
  const stored = await chrome.storage.local.get([
    STORAGE_KEYS.AUTO_LOCK_MINUTES,
  ]);
  autoLockMinutes = stored[STORAGE_KEYS.AUTO_LOCK_MINUTES] ?? AUTOLOCK_MINUTES;
  scheduleAlarm();
})();

/**
 * Track user activity for auto-lock timer
 * Only counts user-initiated actions, not passive polling
 */
function touchActivity(method?: string) {
  if (method && USER_ACTIVITY_METHODS.has(method as any)) {
    lastActivity = Date.now();
  }
}

/**
 * Check if message is from popup/extension page (not content script)
 * Extension pages have chrome-extension:// URLs; content scripts have web URLs
 */
function isFromPopup(sender: chrome.runtime.MessageSender): boolean {
  // Check if the sender URL is from our extension
  const url = sender.url || '';
  const extensionId = chrome.runtime.id;
  return url.startsWith(`chrome-extension://${extensionId}/`);
}

/**
 * Handle messages from content script and popup
 */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    const { payload } = msg || {};
    touchActivity(payload?.method);

    // Guard: internal methods (wallet:*) can only be called from popup/extension pages
    if (payload?.method?.startsWith("wallet:") && !isFromPopup(_sender)) {
      sendResponse({ error: ERROR_CODES.UNAUTHORIZED });
      return;
    }

    switch (payload?.method) {
      // Provider methods (called from injected provider via content script)
      case PROVIDER_METHODS.REQUEST_ACCOUNTS:
        if (vault.isLocked()) {
          sendResponse({ error: ERROR_CODES.LOCKED });
          return;
        }
        const address = vault.getAddress();
        sendResponse([address]);

        // Emit connect event when dApp connects successfully
        await emitWalletEvent('connect', { chainId: 'nockchain-1' });
        return;

      case PROVIDER_METHODS.SIGN_MESSAGE:
        if (vault.isLocked()) {
          sendResponse({ error: ERROR_CODES.LOCKED });
          return;
        }

        // Create sign message approval request
        const newSignRequestId = crypto.randomUUID();
        const signRequest: SignRequest = {
          id: newSignRequestId,
          origin: _sender.url || _sender.origin || 'unknown',
          message: payload.params?.[0] || '',
          timestamp: Date.now(),
        };

        // Store pending request with response callback
        pendingRequests.set(newSignRequestId, {
          request: signRequest,
          sendResponse,
          origin: signRequest.origin,
        });

        // Create approval popup
        await createApprovalPopup(newSignRequestId, 'sign-message');

        // Response will be sent when user approves/rejects
        return;

      case PROVIDER_METHODS.SEND_TRANSACTION:
        if (vault.isLocked()) {
          sendResponse({ error: ERROR_CODES.LOCKED });
          return;
        }
        const { to, amount, fee = DEFAULT_TRANSACTION_FEE } = payload.params?.[0] ?? {};
        if (!isNockAddress(to)) {
          sendResponse({ error: ERROR_CODES.BAD_ADDRESS });
          return;
        }

        // Create transaction approval request
        const txRequestId = crypto.randomUUID();
        const txRequest: TransactionRequest = {
          id: txRequestId,
          origin: _sender.url || _sender.origin || 'unknown',
          to,
          amount,
          fee,
          timestamp: Date.now(),
        };

        // Store pending request with response callback
        pendingRequests.set(txRequestId, {
          request: txRequest,
          sendResponse,
          origin: txRequest.origin,
        });

        // Create approval popup
        await createApprovalPopup(txRequestId, 'transaction');

        // Response will be sent when user approves/rejects
        return;

      // Internal methods (called from popup)
      case INTERNAL_METHODS.SET_AUTO_LOCK:
        autoLockMinutes = payload.params?.[0] ?? 15;
        await chrome.storage.local.set({
          [STORAGE_KEYS.AUTO_LOCK_MINUTES]: autoLockMinutes,
        });
        scheduleAlarm();
        sendResponse({ ok: true });
        return;

      case INTERNAL_METHODS.UNLOCK:
        const unlockResult = await vault.unlock(payload.params?.[0]); // password
        sendResponse(unlockResult);

        // Emit connect event when unlock succeeds
        if ('ok' in unlockResult && unlockResult.ok) {
          await emitWalletEvent('connect', { chainId: 'nockchain-1' });
        }
        return;

      case INTERNAL_METHODS.LOCK:
        await vault.lock();
        sendResponse({ ok: true });

        // Emit disconnect event when wallet locks
        await emitWalletEvent('disconnect', { code: 1013, message: 'Wallet locked' });
        return;

      case INTERNAL_METHODS.SETUP:
        // params: password, mnemonic (optional). If no mnemonic, generates one automatically.
        sendResponse(
          await vault.setup(payload.params?.[0], payload.params?.[1])
        );
        return;

      case INTERNAL_METHODS.GET_STATE:
        sendResponse({
          locked: vault.isLocked(),
          address: await vault.getAddressSafe(),
          accounts: vault.getAccounts(),
          currentAccount: vault.getCurrentAccount(),
        });
        return;

      case INTERNAL_METHODS.GET_ACCOUNTS:
        sendResponse({
          accounts: vault.getAccounts(),
          currentAccount: vault.getCurrentAccount(),
        });
        return;

      case INTERNAL_METHODS.SWITCH_ACCOUNT:
        const switchResult = await vault.switchAccount(payload.params?.[0]);
        sendResponse(switchResult);

        // Emit accountsChanged event to all tabs if successful
        if ('ok' in switchResult && switchResult.ok) {
          await emitWalletEvent('accountsChanged', [switchResult.account.address]);
        }
        return;

      case INTERNAL_METHODS.RENAME_ACCOUNT:
        sendResponse(
          await vault.renameAccount(payload.params?.[0], payload.params?.[1])
        );
        return;

      case INTERNAL_METHODS.CREATE_ACCOUNT:
        // params: name (optional)
        const createResult = await vault.createAccount(payload.params?.[0]);
        sendResponse(createResult);

        // Emit accountsChanged event to all tabs if successful
        // New account is automatically set as current
        if ('ok' in createResult && createResult.ok) {
          await emitWalletEvent('accountsChanged', [createResult.account.address]);
        }
        return;

      case INTERNAL_METHODS.GET_MNEMONIC:
        // params: password (required for verification)
        sendResponse(await vault.getMnemonic(payload.params?.[0]));
        return;

      case INTERNAL_METHODS.GET_AUTO_LOCK:
        sendResponse({ minutes: autoLockMinutes });
        return;

      case INTERNAL_METHODS.GET_BALANCE:
        // TODO: Query blockchain for balance when WASM bindings are ready
        sendResponse({ balance: 0 });
        return;

      // Approval request handlers
      case INTERNAL_METHODS.GET_PENDING_TRANSACTION:
        const getPendingTxId = payload.params?.[0];
        const txPending = pendingRequests.get(getPendingTxId);
        if (txPending && 'to' in txPending.request) {
          sendResponse(txPending.request);
        } else {
          sendResponse({ error: ERROR_CODES.NOT_FOUND });
        }
        return;

      case INTERNAL_METHODS.GET_PENDING_SIGN_REQUEST:
        const getPendingSignId = payload.params?.[0];
        const signPending = pendingRequests.get(getPendingSignId);
        if (signPending && 'message' in signPending.request) {
          sendResponse(signPending.request);
        } else {
          sendResponse({ error: ERROR_CODES.NOT_FOUND });
        }
        return;

      case INTERNAL_METHODS.APPROVE_TRANSACTION:
        const approveTxId = payload.params?.[0];
        const approveTxPending = pendingRequests.get(approveTxId);
        if (approveTxPending && 'to' in approveTxPending.request) {
          // TODO: Implement real transaction signing and RPC broadcast to Nockchain network
          // For now, return a generated transaction ID until WASM signing and RPC are integrated
          const txRequest = approveTxPending.request as TransactionRequest;
          approveTxPending.sendResponse({
            txid: crypto.randomUUID(),
            amount: txRequest.amount,
            fee: txRequest.fee,
          });
          pendingRequests.delete(approveTxId);
          sendResponse({ success: true });
        } else {
          sendResponse({ error: ERROR_CODES.NOT_FOUND });
        }
        return;

      case INTERNAL_METHODS.REJECT_TRANSACTION:
        const rejectTxId = payload.params?.[0];
        const rejectTxPending = pendingRequests.get(rejectTxId);
        if (rejectTxPending) {
          rejectTxPending.sendResponse({
            error: { code: 4001, message: 'User rejected the transaction' },
          });
          pendingRequests.delete(rejectTxId);
          sendResponse({ success: true });
        } else {
          sendResponse({ error: ERROR_CODES.NOT_FOUND });
        }
        return;

      case INTERNAL_METHODS.APPROVE_SIGN_MESSAGE:
        const approveSignId = payload.params?.[0];
        const approveSignPending = pendingRequests.get(approveSignId);
        if (approveSignPending && 'message' in approveSignPending.request) {
          const signRequest = approveSignPending.request as SignRequest;
          const signature = await vault.signMessage([signRequest.message]);
          approveSignPending.sendResponse({ signature });
          pendingRequests.delete(approveSignId);
          sendResponse({ success: true });
        } else {
          sendResponse({ error: ERROR_CODES.NOT_FOUND });
        }
        return;

      case INTERNAL_METHODS.REJECT_SIGN_MESSAGE:
        const rejectSignId = payload.params?.[0];
        const rejectSignPending = pendingRequests.get(rejectSignId);
        if (rejectSignPending) {
          rejectSignPending.sendResponse({
            error: { code: 4001, message: 'User rejected the signature request' },
          });
          pendingRequests.delete(rejectSignId);
          sendResponse({ success: true });
        } else {
          sendResponse({ error: ERROR_CODES.NOT_FOUND });
        }
        return;

      default:
        sendResponse({ error: ERROR_CODES.METHOD_NOT_SUPPORTED });
        return;
    }
  })();
  // Required: tells Chrome we'll call sendResponse asynchronously from the IIFE
  return true;
});

/**
 * Handle auto-lock alarm
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAMES.AUTO_LOCK) return;

  const idleMs = Date.now() - lastActivity;
  if (idleMs >= autoLockMinutes * 60_000) {
    await vault.lock();
  }

  scheduleAlarm();
});

/**
 * Schedule the auto-lock alarm (runs every minute)
 */
function scheduleAlarm() {
  chrome.alarms.create(ALARM_NAMES.AUTO_LOCK, {
    delayInMinutes: 1,
    periodInMinutes: 1,
  });
}
