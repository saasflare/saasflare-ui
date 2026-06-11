// @draft
"use client"

/**
 * @fileoverview Detect user inactivity after a configurable timeout.
 * @author Saasflare™
 * @module packages/ui/hooks/use-idle
 * @package ui
 *
 * @example
 * const isIdle = useIdle(5 * 60 * 1000); // 5 minutes
 * if (isIdle) showSessionWarning();
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** Events that reset the idle timer */
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'pointerdown',
];

/**
 * Returns `true` when the user has been inactive for the given duration.
 * Resets on mouse, keyboard, touch, and scroll activity.
 *
 * @param {number} [timeoutMs=60000] - Inactivity threshold in milliseconds
 * @param {boolean} [enabled=true] - Whether idle detection is active
 * @returns {boolean} Whether the user is currently idle
 *
 * @example
 * const idle = useIdle(3 * 60 * 1000); // 3 minutes
 * // Show "Are you still there?" dialog when idle
 */
export function useIdle(timeoutMs = 60_000, enabled = true): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsIdle(true), timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    if (!enabled) return;

    resetTimer();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [enabled, resetTimer]);

  return isIdle;
}
