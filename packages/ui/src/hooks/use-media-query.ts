// @draft
/**
 * @fileoverview Generic media query hook with SSR safety.
 * @author Saasflare™
 * @module packages/ui/hooks/use-media-query
 * @package ui
 *
 * @example
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 * const prefersReducedData = useMediaQuery('(prefers-reduced-data: reduce)');
 */
'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 *
 * @param {string} query - A valid CSS media query string
 * @param {boolean} [defaultValue=false] - Value returned during SSR
 * @returns {boolean} Whether the media query currently matches
 *
 * @example
 * const isPortrait = useMediaQuery('(orientation: portrait)');
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
