// @draft
"use client"

/**
 * @fileoverview Copy-to-clipboard hook with "copied!" feedback state.
 * @author Saasflare™
 * @module packages/ui/hooks/use-clipboard
 * @package ui
 *
 * @example
 * const { copy, copied, error } = useClipboard();
 * <Button onClick={() => copy('Hello!')}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </Button>
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** Return type for the useClipboard hook */
export interface UseClipboardReturn {
  /** Copy text to the clipboard */
  copy: (text: string) => Promise<void>;
  /** Whether text was recently copied (resets after timeout) */
  copied: boolean;
  /** Error message if the copy operation failed */
  error: string | null;
}

/**
 * Provides a `copy` function that writes text to the clipboard
 * and a `copied` state that auto-resets after the given timeout.
 *
 * @param {number} [resetMs=2000] - Duration in ms before `copied` resets to false
 * @returns {UseClipboardReturn} Copy function, copied state, and error
 *
 * @example
 * const { copy, copied } = useClipboard(3000);
 * // copied stays true for 3 seconds after copy()
 */
export function useClipboard(resetMs = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Clear the pending reset timer when the consumer unmounts.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetMs);
      } catch (err) {
        setCopied(false);
        setError(err instanceof Error ? err.message : 'Failed to copy');
      }
    },
    [resetMs],
  );

  return { copy, copied, error };
}
