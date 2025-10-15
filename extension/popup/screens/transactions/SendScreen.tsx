/**
 * Send Screen - Send NOCK transactions
 */

import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';

export function SendScreen() {
  const { navigate } = useStore();

  return (
    <ScreenContainer>
      <h2 className="text-xl font-semibold mb-4">Send NOCK</h2>
      <p className="text-sm text-gray-400 mb-6">
        Send transaction (placeholder)
      </p>
      {/* TODO: Implement send form from Figma */}
      <button onClick={() => navigate('home')} className="btn-secondary">
        Back
      </button>
    </ScreenContainer>
  );
}
