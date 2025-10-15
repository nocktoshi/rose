/**
 * Onboarding Success Screen - Wallet created successfully
 */

import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';

export function SuccessScreen() {
  const { navigate } = useStore();

  return (
    <ScreenContainer>
      <h2 className="text-xl font-semibold mb-4">Wallet Created!</h2>
      <p className="text-sm text-gray-400 mb-6">
        Your wallet has been created successfully
      </p>
      <button onClick={() => navigate('home')} className="btn-primary">
        Get Started
      </button>
    </ScreenContainer>
  );
}
