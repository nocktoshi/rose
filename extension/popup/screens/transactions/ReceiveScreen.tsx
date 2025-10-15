/**
 * Receive Screen - Display address and QR code
 */

import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';

export function ReceiveScreen() {
  const { navigate, wallet } = useStore();

  return (
    <ScreenContainer>
      <h2 className="text-xl font-semibold mb-4">Receive NOCK</h2>
      <div className="address-display my-4">
        <div className="label">Your Address:</div>
        <div>{wallet.currentAccount?.address || "(none)"}</div>
      </div>
      {/* TODO: Add QR code */}
      <button onClick={() => navigate('home')} className="btn-secondary">
        Back
      </button>
    </ScreenContainer>
  );
}
