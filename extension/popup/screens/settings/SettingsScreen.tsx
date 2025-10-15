/**
 * Settings Screen - Wallet settings and configuration
 */

import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';

export function SettingsScreen() {
  const { navigate } = useStore();

  return (
    <ScreenContainer>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <p className="text-sm text-gray-400 mb-6">
        Settings (placeholder)
      </p>
      {/* TODO: Implement settings from Figma */}
      <button onClick={() => navigate('home')} className="btn-secondary">
        Back
      </button>
    </ScreenContainer>
  );
}
