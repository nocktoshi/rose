/**
 * Onboarding Import Screen - Import wallet from mnemonic
 */

import { useState, useRef } from 'react';
import { useStore } from '../../store';
import { Alert } from '../../components/Alert';
import { useAutoFocus } from '../../hooks/useAutoFocus';
import { markOnboardingComplete } from '../../../shared/onboarding';
import { INTERNAL_METHODS, UI_CONSTANTS, ERROR_CODES } from '../../../shared/constants';
import { send } from '../../utils/messaging';
import lockIcon from '../../assets/lock-icon.svg';

export function ImportScreen() {
  const { navigate, syncWallet, setOnboardingMnemonic } = useStore();
  const [words, setWords] = useState<string[]>(Array(UI_CONSTANTS.MNEMONIC_WORD_COUNT).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'mnemonic' | 'password'>('mnemonic');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const firstInputRef = useAutoFocus<HTMLInputElement>();

  function handleWordChange(index: number, value: string) {
    const trimmedValue = value.trim().toLowerCase();
    const newWords = [...words];
    newWords[index] = trimmedValue;
    setWords(newWords);
    setError('');

    // Auto-advance to next field on space
    if (value.endsWith(' ')) {
      const nextIndex = index + 1;
      if (nextIndex < UI_CONSTANTS.MNEMONIC_WORD_COUNT) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  }

  // Handle paste in first field to auto-fill all words
  function handlePaste(index: number, e: React.ClipboardEvent<HTMLInputElement>) {
    if (index === 0) {
      const pasteData = e.clipboardData.getData('text');
      const pastedWords = pasteData.trim().toLowerCase().split(/\s+/);

      if (pastedWords.length === UI_CONSTANTS.MNEMONIC_WORD_COUNT) {
        e.preventDefault();
        setWords(pastedWords);
        setError('');
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    // Backspace on empty field goes to previous
    if (e.key === 'Backspace' && !words[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Enter advances to next field
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < UI_CONSTANTS.MNEMONIC_WORD_COUNT) {
        inputRefs.current[nextIndex]?.focus();
      } else {
        handleContinue();
      }
    }
  }

  function handleContinue() {
    const mnemonic = words.join(' ').trim();

    if (words.some(w => !w)) {
      setError('Please enter all 24 words');
      return;
    }

    // Store mnemonic and move to password setup
    setOnboardingMnemonic(mnemonic);
    setStep('password');
  }

  async function handleImport() {
    const mnemonic = words.join(' ').trim();

    // Validate password
    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < UI_CONSTANTS.MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${UI_CONSTANTS.MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Import wallet (setup with existing mnemonic)
    const result = await send<{
      ok?: boolean;
      address?: string;
      mnemonic?: string;
      error?: string;
    }>(INTERNAL_METHODS.SETUP, [password, mnemonic]);

    if (result?.error) {
      if (result.error === ERROR_CODES.INVALID_MNEMONIC) {
        setError('Invalid recovery phrase. Please check your words and try again.');
      } else {
        setError(`Error: ${result.error}`);
      }
    } else {
      // Successfully imported - mark onboarding complete (user already has their seed)
      await markOnboardingComplete();

      const firstAccount = {
        name: 'Wallet 1',
        address: result.address || '',
        index: 0,
      };
      syncWallet({
        locked: false,
        address: result.address || null,
        accounts: [firstAccount],
        currentAccount: firstAccount,
        balance: 0,
        accountBalances: {},
      });
      setOnboardingMnemonic(null);
      navigate('onboarding-import-success');
    }
  }

  function handleBack() {
    if (step === 'password') {
      setStep('mnemonic');
    } else {
      navigate('onboarding-start');
    }
  }

  // Password setup step
  if (step === 'password') {
    return (
      <div className="relative w-[357px] h-[600px] bg-[var(--color-bg)]">
        {/* Header with back button */}
        <div className="flex items-center justify-between h-16 px-4 py-3 border-b border-[var(--color-divider)]">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:opacity-70 transition-opacity"
            aria-label="Go back"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="var(--color-text-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2
            className="font-sans font-medium text-[var(--color-text-primary)]"
            style={{
              fontSize: 'var(--font-size-lg)',
              lineHeight: 'var(--line-height-normal)',
              letterSpacing: '0.01em',
            }}
          >
            Encrypt your wallet
          </h2>
          <div className="w-8" />
        </div>

        {/* Main content */}
        <div className="flex flex-col justify-between h-[536px]">
          <div className="px-4 py-2 flex flex-col gap-6">
            {/* Icon and heading */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10">
                <img src={lockIcon} alt="" className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-2 items-center text-center w-full">
                <h1
                  className="font-serif font-medium text-[var(--color-text-primary)]"
                  style={{
                    fontSize: 'var(--font-size-xl)',
                    lineHeight: 'var(--line-height-relaxed)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Choose a strong password
                </h1>
                <p
                  className="font-sans text-[var(--color-text-muted)]"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: 'var(--line-height-snug)',
                    letterSpacing: '0.02em',
                  }}
                >
                  This password encrypts your wallet
                </p>
              </div>
            </div>

            {/* Password fields */}
            <div className="flex flex-col gap-3 w-full">
              {/* Password input */}
              <div className="bg-[var(--color-bg)] border border-[var(--color-surface-700)] rounded-lg p-3 flex items-center gap-2.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Password"
                  className="flex-1 bg-transparent font-sans font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none"
                  style={{
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-snug)',
                    letterSpacing: '0.01em',
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2 2L18 18M10 7C11.6569 7 13 8.34315 13 10C13 10.3453 12.9417 10.6768 12.8347 10.9861M10 13C8.34315 13 7 11.6569 7 10C7 9.65468 7.05829 9.32318 7.16529 9.01389M10 5C12.7614 5 15.0459 6.57757 16.3814 8.40121C16.7583 8.94075 16.7583 9.65925 16.3814 10.1988C15.6736 11.2042 14.7929 12.0706 13.7921 12.7489M10 15C7.23858 15 4.95409 13.4224 3.61863 11.5988C3.24172 11.0592 3.24172 10.3407 3.61863 9.80121C4.32644 8.79577 5.20714 7.92942 6.20789 7.25105"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 7C11.6569 7 13 8.34315 13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M10 5C12.7614 5 15.0459 6.57757 16.3814 8.40121C16.7583 8.94075 16.7583 9.65925 16.3814 10.1988C15.0459 12.0224 12.7614 13.6 10 13.6C7.23858 13.6 4.95409 12.0224 3.61863 10.1988C3.24172 9.65925 3.24172 8.94075 3.61863 8.40121C4.95409 6.57757 7.23858 5 10 5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Confirm password input */}
              <div className="bg-[var(--color-bg)] border border-[var(--color-surface-700)] rounded-lg p-3 flex items-center gap-2.5">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleImport()}
                  placeholder="Confirm password"
                  className="flex-1 bg-transparent font-sans font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none"
                  style={{
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-snug)',
                    letterSpacing: '0.01em',
                  }}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2 2L18 18M10 7C11.6569 7 13 8.34315 13 10C13 10.3453 12.9417 10.6768 12.8347 10.9861M10 13C8.34315 13 7 11.6569 7 10C7 9.65468 7.05829 9.32318 7.16529 9.01389M10 5C12.7614 5 15.0459 6.57757 16.3814 8.40121C16.7583 8.94075 16.7583 9.65925 16.3814 10.1988C15.6736 11.2042 14.7929 12.0706 13.7921 12.7489M10 15C7.23858 15 4.95409 13.4224 3.61863 11.5988C3.24172 11.0592 3.24172 10.3407 3.61863 9.80121C4.32644 8.79577 5.20714 7.92942 6.20789 7.25105"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 7C11.6569 7 13 8.34315 13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M10 5C12.7614 5 15.0459 6.57757 16.3814 8.40121C16.7583 8.94075 16.7583 9.65925 16.3814 10.1988C15.0459 12.0224 12.7614 13.6 10 13.6C7.23858 13.6 4.95409 12.0224 3.61863 10.1988C3.24172 9.65925 3.24172 8.94075 3.61863 8.40121C4.95409 6.57757 7.23858 5 10 5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Info box */}
              <div className="bg-[var(--color-surface-900)] rounded-lg p-3">
                <p
                  className="font-sans font-medium text-center text-[var(--color-text-muted)]"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    lineHeight: 'var(--line-height-tight)',
                    letterSpacing: '0.02em',
                  }}
                >
                  Minimum {UI_CONSTANTS.MIN_PASSWORD_LENGTH} characters
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && <Alert type="error">{error}</Alert>}
          </div>

          {/* Bottom buttons */}
          <div className="border-t border-[var(--color-surface-800)] px-4 py-3">
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 h-12 px-5 py-[15px] bg-[var(--color-surface-800)] text-[var(--color-text-primary)] rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 500,
                  lineHeight: 'var(--line-height-snug)',
                  letterSpacing: '0.01em',
                }}
              >
                Back
              </button>
              <button
                onClick={handleImport}
                className="flex-1 h-12 px-5 py-[15px] bg-[var(--color-primary)] text-[#000000] rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 500,
                  lineHeight: 'var(--line-height-snug)',
                  letterSpacing: '0.01em',
                }}
              >
                Import wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mnemonic entry step
  return (
    <div className="relative w-[357px] h-[600px] bg-[var(--color-bg)]">
      {/* Header with back button */}
      <div className="flex items-center justify-between h-16 px-4 py-3 border-b border-[var(--color-divider)]">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 hover:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="var(--color-text-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2
          className="font-sans font-medium text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--line-height-normal)',
            letterSpacing: '0.01em',
          }}
        >
          Import wallet
        </h2>
        <div className="w-8" />
      </div>

      {/* Main content - scrollable */}
      <div className="h-[536px] flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="px-4 py-2 flex flex-col gap-6">
            {/* Icon and instructions */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10">
                <img src={lockIcon} alt="" className="w-full h-full" />
              </div>
              <p
                className="font-sans font-medium text-center text-[var(--color-text-primary)]"
                style={{
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-snug)',
                  letterSpacing: '0.01em',
                }}
              >
                Enter your 24-word recovery phrase.
                <br />
                Paste into first field to auto-fill all words.
              </p>
            </div>

            {/* 24-word input grid */}
            <div className="flex flex-col gap-2 w-full pb-4">
              {Array.from({ length: 12 }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 w-full">
                  {[0, 1].map(col => {
                    const index = rowIndex * 2 + col;
                    return (
                      <div
                        key={col}
                        className="flex-1 min-w-0 bg-[var(--color-bg)] border border-[var(--color-surface-700)] rounded-lg p-2 flex items-center gap-2.5 h-11"
                      >
                        <span
                          className="bg-[var(--color-surface-900)] rounded w-7 h-7 flex items-center justify-center font-sans font-medium text-[var(--color-text-primary)] flex-shrink-0"
                          style={{
                            fontSize: 'var(--font-size-base)',
                            lineHeight: 'var(--line-height-snug)',
                            letterSpacing: '0.01em',
                          }}
                        >
                          {index + 1}
                        </span>
                        <input
                          ref={el => {
                            inputRefs.current[index] = el;
                            if (index === 0) {
                              // @ts-ignore - Assign to auto-focus ref
                              firstInputRef.current = el;
                            }
                          }}
                          type="text"
                          value={words[index]}
                          onChange={e => handleWordChange(index, e.target.value)}
                          onKeyDown={e => handleKeyDown(index, e)}
                          onPaste={e => handlePaste(index, e)}
                          placeholder="word"
                          autoComplete="off"
                          spellCheck="false"
                          className="flex-1 min-w-0 bg-transparent font-sans font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none"
                          style={{
                            fontSize: 'var(--font-size-base)',
                            lineHeight: 'var(--line-height-snug)',
                            letterSpacing: '0.01em',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && <Alert type="error">{error}</Alert>}
          </div>
        </div>

        {/* Bottom button */}
        <div className="border-t border-[var(--color-surface-800)] px-4 py-3">
          <button
            onClick={handleContinue}
            disabled={words.some(w => !w)}
            className="w-full h-12 px-5 py-[15px] bg-[var(--color-primary)] text-[#000000] rounded-lg flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 500,
              lineHeight: 'var(--line-height-snug)',
              letterSpacing: '0.01em',
            }}
          >
            Import wallet
          </button>
        </div>
      </div>
    </div>
  );
}
