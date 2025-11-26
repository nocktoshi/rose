/**
 * useAutoFocus - Auto-focus an input element
 *
 * @param options - Configuration options
 * @param options.when - Condition that triggers focus (defaults to true for mount-only focus)
 * @param options.select - Whether to select all text after focusing
 * @returns Ref to attach to the input element
 *
 */

import { useRef, useEffect } from 'react';

interface UseAutoFocusOptions {
  /** Condition that triggers focus. Defaults to true (focus on mount) */
  when?: boolean | unknown;
  /** Whether to select all text after focusing. Defaults to false */
  select?: boolean;
}

export function useAutoFocus<T extends HTMLInputElement | HTMLTextAreaElement>(
  options: UseAutoFocusOptions = {}
): React.RefObject<T | null> {
  const { when = true, select = false } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    if (when && ref.current) {
      ref.current.focus();
      if (select) {
        ref.current.select();
      }
    }
  }, [when, select]);

  return ref;
}
