/**
 * Onboarding Verify Screen - Verify user wrote down mnemonic correctly
 */

import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Alert } from '../../components/Alert';

export function VerifyScreen() {
  const { onboardingMnemonic, navigate, setOnboardingMnemonic } = useStore();
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!onboardingMnemonic) return;

    const words = onboardingMnemonic.split(' ');

    // Pick a random word to test (avoid first and last few for better security awareness)
    const randomIndex = Math.floor(Math.random() * (words.length - 4)) + 2;
    setTestIndex(randomIndex);

    // Create options: correct word + 3 random other words from the mnemonic
    const correctWord = words[randomIndex];
    const otherWords = words.filter((_, i) => i !== randomIndex);
    const randomOthers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Shuffle all options
    const allOptions = [correctWord, ...randomOthers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  }, [onboardingMnemonic]);

  if (!onboardingMnemonic) {
    return (
      <ScreenContainer>
        <h2 className="text-xl font-semibold mb-4 text-red-500">Error</h2>
        <p className="text-sm text-gray-400">No mnemonic found. Please restart onboarding.</p>
        <button onClick={() => navigate('onboarding-start')} className="btn-primary my-2">
          Back to Start
        </button>
      </ScreenContainer>
    );
  }

  const words = onboardingMnemonic.split(' ');
  const correctWord = words[testIndex];

  function handleVerify() {
    if (selectedWord === correctWord) {
      setIsCorrect(true);
      // Wait a moment then navigate to success
      setTimeout(() => {
        // Clear the mnemonic from memory
        setOnboardingMnemonic(null);
        navigate('onboarding-success');
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  }

  function handleBack() {
    navigate('onboarding-backup');
  }

  return (
    <ScreenContainer className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Verify Recovery Phrase</h2>

      <p className="text-sm text-gray-400 mb-6">
        Select the correct word for position <strong>#{testIndex + 1}</strong>
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {options.map((word) => (
          <button
            key={word}
            onClick={() => setSelectedWord(word)}
            className={`p-3 rounded border transition-colors ${
              selectedWord === word
                ? 'bg-blue-600 border-blue-500'
                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            }`}
          >
            <span className="font-mono">{word}</span>
          </button>
        ))}
      </div>

      {isCorrect === false && (
        <Alert type="error" className="mb-4">
          Incorrect word. Please review your recovery phrase and try again.
        </Alert>
      )}

      {isCorrect === true && (
        <Alert type="success" className="mb-4">
          Correct! Setting up your wallet...
        </Alert>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={handleVerify}
          disabled={!selectedWord || isCorrect === true}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify
        </button>
        <button onClick={handleBack} className="btn-secondary">
          Back to Recovery Phrase
        </button>
      </div>
    </ScreenContainer>
  );
}
