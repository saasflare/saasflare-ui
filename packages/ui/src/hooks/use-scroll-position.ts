// @draft
"use client"

/**
 * @fileoverview Track scroll position and direction with optional throttling.
 * @author Saasflare™
 * @module packages/ui/hooks/use-scroll-position
 * @package ui
 *
 * @example
 * const { x, y, direction } = useScrollPosition();
 * // direction is 'up', 'down', or null (no scroll yet)
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Scroll direction: 'up', 'down', or null if not yet determined */
export type ScrollDirection = 'up' | 'down' | null;

/** Return type for the useScrollPosition hook */
export interface ScrollPosition {
  /** Horizontal scroll offset in pixels */
  x: number;
  /** Vertical scroll offset in pixels */
  y: number;
  /** Current vertical scroll direction */
  direction: ScrollDirection;
}

/** Options for useScrollPosition */
export interface UseScrollPositionOptions {
  /** Throttle interval in ms. Default: `0` (every frame via rAF) */
  throttleMs?: number;
  /** Custom scrollable element ref. Defaults to window. */
  element?: React.RefObject<HTMLElement | null>;
}

/**
 * Tracks the current scroll position and vertical direction.
 *
 * @param {UseScrollPositionOptions} [options] - Throttle and element options
 * @returns {ScrollPosition} Current x, y offsets and scroll direction
 *
 * @example
 * const { y, direction } = useScrollPosition({ throttleMs: 100 });
 * const showNav = direction === 'up' || y < 100;
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): ScrollPosition {
  const { throttleMs = 0, element } = options;
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0, direction: null });
  const prevY = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef(0);

  const update = useCallback(() => {
    const target = element?.current;
    const x = target ? target.scrollLeft : window.scrollX;
    const y = target ? target.scrollTop : window.scrollY;
    const direction: ScrollDirection = y > prevY.current ? 'down' : y < prevY.current ? 'up' : null;
    prevY.current = y;
    setPosition({ x, y, direction });
  }, [element]);

  useEffect(() => {
    const target = element?.current ?? window;

    const handleScroll = () => {
      if (throttleMs > 0) {
        const now = Date.now();
        if (now - lastUpdateRef.current >= throttleMs) {
          lastUpdateRef.current = now;
          update();
        }
      } else {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(update);
      }
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    update(); // initial read

    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [element, throttleMs, update]);

  return position;
}
