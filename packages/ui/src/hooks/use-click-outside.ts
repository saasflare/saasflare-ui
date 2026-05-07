// @draft
"use client"

/**
 * @fileoverview Detect clicks outside a referenced element.
 * @author Saasflare™
 * @module packages/ui/hooks/use-click-outside
 * @package ui
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setOpen(false));
 * return <div ref={ref}>Dropdown content</div>;
 */
'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Calls the handler when a click or touch occurs outside the referenced element.
 *
 * @param {RefObject<HTMLElement | null>} ref - The element to detect outside clicks for
 * @param {(event: MouseEvent | TouchEvent) => void} handler - Called on outside click
 * @param {boolean} [enabled=true] - Whether the listener is active
 *
 * @example
 * const menuRef = useRef<HTMLDivElement>(null);
 * useClickOutside(menuRef, handleClose, isMenuOpen);
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      savedHandler.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, enabled]);
}
