/**
 * Home Screen - Main wallet view showing balance and actions
 */

import { INTERNAL_METHODS } from "../../../shared/constants";
import { useStore } from "../../store";
import { send } from "../../utils/messaging";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AccountSelector } from "../../components/AccountSelector";
import { RecentTransactions } from "../../components/RecentTransactions";

export function HomeScreen() {
  const { wallet, navigate, syncWallet } = useStore();

  async function handleLock() {
    await send(INTERNAL_METHODS.LOCK);
    syncWallet({ ...wallet, locked: true });
    navigate("locked");
  }

  return (
    <ScreenContainer className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Fort Nock</h2>

      {/* Account Selector */}
      <div className="mb-4">
        <AccountSelector />
      </div>

      <div className="my-4">
        <div className="text-sm text-gray-400 mb-2">Balance</div>
        <div className="text-3xl font-bold">0.00 NOCK</div>
      </div>

      <div className="grid grid-cols-2 gap-2 my-4">
        <button onClick={() => navigate("send")} className="btn-primary">
          Send
        </button>
        <button onClick={() => navigate("receive")} className="btn-secondary">
          Receive
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <RecentTransactions onViewAll={() => navigate("home")} />
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 space-y-2">
        <button
          onClick={() => navigate("settings")}
          className="btn-secondary"
        >
          Settings
        </button>

        <button onClick={handleLock} className="btn-secondary">
          Lock
        </button>
      </div>
    </ScreenContainer>
  );
}
