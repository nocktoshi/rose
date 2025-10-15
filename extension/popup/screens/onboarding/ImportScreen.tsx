/**
 * Onboarding Import Screen - Import wallet from mnemonic
 */

import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';

export function ImportScreen() {
  const { navigate } = useStore();

  return (
    <ScreenContainer>
      <h2 className="text-xl font-semibold mb-4">Import Wallet</h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter your 24-word recovery phrase
      </p>
      {/* TODO: Implement 24-word grid from Figma */}
      <button onClick={() => navigate('onboarding-start')} className="btn-secondary">
        Back
      </button>
    </ScreenContainer>
  );
}
