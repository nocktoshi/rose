/**
 * Custom hook for managing numeric input fields with validation and increment/decrement
 */

import { useState } from 'react';

interface UseNumericInputOptions {
  /** Initial value (default: '') */
  initialValue?: string;
  /** Minimum allowed value (default: 0) */
  min?: number;
  /** Maximum allowed value (default: Infinity) */
  max?: number;
  /** Increment/decrement step size (default: 1) */
  step?: number;
}

interface UseNumericInputReturn {
  /** Current input value as string */
  value: string;
  /** Set the value directly */
  setValue: (value: string) => void;
  /** Handle input change with validation (only allows numeric input) */
  handleChange: (value: string) => void;
  /** Increment by step amount */
  increment: () => void;
  /** Decrement by step amount */
  decrement: () => void;
  /** Get numeric value as number (returns 0 if empty) */
  numericValue: number;
}

/**
 * Hook for managing numeric input with validation and increment/decrement controls
 *
 * @example
 * const amount = useNumericInput({ min: 0, max: 100 });
 *
 * <input value={amount.value} onChange={(e) => amount.handleChange(e.target.value)} />
 * <button onClick={amount.increment}>+</button>
 * <button onClick={amount.decrement}>-</button>
 */
export function useNumericInput(options: UseNumericInputOptions = {}): UseNumericInputReturn {
  const { initialValue = '', min = 0, max = Infinity, step = 1 } = options;

  const [value, setValue] = useState(initialValue);

  /**
   * Parse string value to number, defaulting to 0 if empty
   */
  const getNumericValue = (val: string): number => {
    return val === '' ? 0 : parseFloat(val);
  };

  /**
   * Validate and set value if it passes numeric regex
   */
  const handleChange = (newValue: string) => {
    // Only allow numbers and decimal point
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  /**
   * Increment by step, respecting max constraint
   */
  const increment = () => {
    const current = getNumericValue(value);
    const newValue = Math.min(current + step, max);
    setValue(newValue.toString());
  };

  /**
   * Decrement by step, respecting min constraint
   */
  const decrement = () => {
    const current = getNumericValue(value);
    if (current > min) {
      const newValue = Math.max(current - step, min);
      setValue(newValue.toString());
    }
  };

  return {
    value,
    setValue,
    handleChange,
    increment,
    decrement,
    numericValue: getNumericValue(value),
  };
}
