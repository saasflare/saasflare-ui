// @draft
"use client"

/**
 * @fileoverview Returns the previous value of a variable.
 * @author Saasflare™
 * @module packages/ui/hooks/use-previous
 * @package ui
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * // prevCount is the value of count from the previous render
 */

import { useEffect, useRef } from 'react';

/**
 * Stores and returns the value from the previous render.
 * Returns `undefined` on the first render.
 *
 * @param {T} value - The value to track
 * @returns {T | undefined} The value from the previous render
 *
 * @example
 * const prevRoute = usePrevious(pathname);
 * if (prevRoute !== pathname) logNavigation(prevRoute, pathname);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
