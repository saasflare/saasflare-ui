// @draft
/**
 * @fileoverview Lock/unlock body scroll (for modals, drawers, overlays).
 * @author Saasflare™
 * @module packages/ui/hooks/use-scroll-lock
 * @package ui
 *
 * @example
 * useScrollLock(isModalOpen);
 */
'use client';

import { useEffect, useRef } from 'react';

/**
 * Locks body scroll when `locked` is true, restores when false or on unmount.
 * Preserves the original overflow value and prevents scroll-jump by
 * accounting for the scrollbar width.
 *
 * @param {boolean} locked - Whether to lock body scroll
 *
 * @example
 * const [drawerOpen, setDrawerOpen] = useState(false);
 * useScrollLock(drawerOpen);
 */
export function useScrollLock(locked: boolean): void {
  const originalStyleRef = useRef('');

  useEffect(() => {
    if (!locked) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    originalStyleRef.current = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyleRef.current;
      document.body.style.paddingRight = '';
    };
  }, [locked]);
}
