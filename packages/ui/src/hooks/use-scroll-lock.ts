// @draft
"use client"

/**
 * @fileoverview Lock/unlock body scroll (for modals, drawers, overlays).
 * @author Saasflare™
 * @module packages/ui/hooks/use-scroll-lock
 * @package ui
 *
 * @example
 * useScrollLock(isModalOpen);
 */

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
  const originalStyleRef = useRef({ overflow: '', paddingRight: '' });

  useEffect(() => {
    if (!locked) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    originalStyleRef.current = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Restore BOTH saved values — resetting paddingRight to '' would
      // clobber a pre-existing inline body padding.
      document.body.style.overflow = originalStyleRef.current.overflow;
      document.body.style.paddingRight = originalStyleRef.current.paddingRight;
    };
  }, [locked]);
}
