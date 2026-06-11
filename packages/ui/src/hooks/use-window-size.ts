// @draft
"use client"

/**
 * @fileoverview Reactive window dimensions with optional debounce.
 * @author Saasflare™
 * @module packages/ui/hooks/use-window-size
 * @package ui
 *
 * @example
 * const { width, height } = useWindowSize();
 * const columns = width > 1024 ? 3 : width > 640 ? 2 : 1;
 */

import { useCallback, useEffect, useState } from 'react';

/** Window dimensions */
export interface WindowSize {
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels */
  height: number;
}

/**
 * Returns the current window dimensions, updating on resize.
 *
 * @param {number} [debounceMs=100] - Debounce delay for resize events in ms
 * @returns {WindowSize} Current width and height
 *
 * @example
 * const { width, height } = useWindowSize(150);
 * const isWide = width >= 1280;
 */
export function useWindowSize(debounceMs = 100): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  const update = useCallback(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    update(); // initial read

    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(update, debounceMs);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [debounceMs, update]);

  return size;
}
