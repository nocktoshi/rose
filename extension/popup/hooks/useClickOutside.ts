/**
 * useClickOutside - Detect clicks outside a referenced element
 *
 * @param ref - Reference to the element to detect clicks outside of
 * @param handler - Callback function to execute when clicking outside
 * @param enabled - Whether the listener is active (defaults to true)
 *
 */

import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      // Check if click is outside the referenced element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    }

    // Listen for mousedown events
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener on unmount or when dependencies change
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler, enabled]);
}
