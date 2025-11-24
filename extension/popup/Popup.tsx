/**
 * Popup UI: App initialization and lifecycle management
 */

import { useEffect } from "react";
import { useStore } from "./store";
import { send } from "./utils/messaging";
import { INTERNAL_METHODS, UI_CONSTANTS } from "../shared/constants";
import { Account } from "../shared/types";
import { Router } from "./Router";
import { useApprovalDetection } from "./hooks/useApprovalDetection";

export function Popup() {
  const {
    currentScreen,
    initialize,
    wallet,
    syncWallet,
    navigate,
    setPendingConnectRequest,
    setPendingTransactionRequest,
    setPendingSignRequest,
  } = useStore();

  // Initialize app on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle approval requests from URL hash
  useApprovalDetection({
    walletAddress: wallet.address,
    walletLocked: wallet.locked,
    setPendingConnectRequest,
    setPendingTransactionRequest,
    setPendingSignRequest,
    navigate,
  });

  // Poll for vault state changes (e.g., auto-lock)
  useEffect(() => {
    const interval = setInterval(async () => {
      // Only poll if we're not already on the locked screen
      if (currentScreen === "locked") return;

      const state = await send<{
        locked: boolean;
        address: string;
        accounts: Account[];
        currentAccount: Account | null;
      }>(INTERNAL_METHODS.GET_STATE);

      // If vault became locked, navigate to locked screen
      if (state.locked && !wallet.locked) {
        syncWallet({
          locked: true,
          address: state.address || null,
          accounts: state.accounts || [],
          currentAccount: state.currentAccount || null,
          balance: wallet.balance || 0, // Preserve balance
          accountBalances: wallet.accountBalances || {},
        });
        navigate("locked");
      }
    }, UI_CONSTANTS.STATE_POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [currentScreen, wallet.locked, wallet.balance, syncWallet, navigate]);

  // Poll for transaction confirmation updates
  useEffect(() => {
    async function updateConfirmations() {
      console.log('[Popup] Confirmation polling tick', {
        locked: wallet.locked,
        hasAccount: !!wallet.currentAccount,
      });

      // Skip if wallet is locked or no account
      if (wallet.locked || !wallet.currentAccount) {
        console.log('[Popup] Skipping poll - wallet locked or no account');
        return;
      }

      // Get fresh transaction data
      const result = await send<{ transactions: any[] }>(
        INTERNAL_METHODS.GET_CACHED_TRANSACTIONS,
        [wallet.currentAccount.address]
      );
      const transactions = result?.transactions || [];

      // Check if we have any transactions that need confirmation tracking
      const { REQUIRED_CONFIRMATIONS } = await import('../shared/constants');
      const needsTracking = transactions.some(
        (tx: any) =>
          tx.status === 'pending' ||
          (tx.status === 'confirmed' && (tx.confirmations ?? 0) < REQUIRED_CONFIRMATIONS)
      );

      if (!needsTracking) {
        return;
      }

      console.log('[Popup] Polling for confirmation updates...');

      try {
        // Import RPC client lazily to avoid WASM init issues
        const { createBrowserClient } = await import('../shared/rpc-client-browser');
        const rpcClient = createBrowserClient();

        // Get current block height
        const currentBlockHeight = await rpcClient.getCurrentBlockHeight();
        console.log('[Popup] Current block height:', currentBlockHeight);

        if (currentBlockHeight === BigInt(0)) {
          console.warn('[Popup] Invalid block height, skipping poll');
          return;
        }

        // Check pending transactions for confirmation
        for (const tx of transactions.filter((t: any) => t.status === 'pending')) {
          const accepted = await rpcClient.isTransactionAccepted(tx.txid);
          if (accepted) {
            console.log(`[Popup] Transaction ${tx.txid.slice(0, 20)}... confirmed`);
            // Update via store
            const { useStore } = await import('./store');
            const store = useStore.getState();
            await store.updateTransactionStatus(
              tx.txid,
              'confirmed',
              Number(currentBlockHeight)
            );
          }
        }

        // Update confirmation counts for confirmed transactions
        const confirmedTxs = transactions.filter(
          (t: any) => t.status === 'confirmed' && t.confirmedAtBlock && t.confirmedAtBlock > 0
        );

        if (confirmedTxs.length > 0) {
          // Send a single update to recalculate confirmations for all transactions
          const { useStore } = await import('./store');
          const store = useStore.getState();
          await store.updateTransactionConfirmations(Number(currentBlockHeight));
          console.log(
            `[Popup] Updated confirmation counts for ${confirmedTxs.length} transactions at block ${currentBlockHeight}`
          );
        }
      } catch (error) {
        console.error('[Popup] Error polling confirmations:', error);
      }
    }

    // Poll every 15 seconds - runs continuously
    console.log('[Popup] Starting confirmation polling interval (15s)');
    const interval = setInterval(updateConfirmations, 15000);
    updateConfirmations(); // Run immediately on mount

    return () => {
      console.log('[Popup] Stopping confirmation polling interval');
      clearInterval(interval);
    };
  }, []); // Empty deps - interval runs independently

  // Render current screen via router
  return <Router />;
}
