// @draft
"use client"

/**
 * @fileoverview Track mouse/pointer position relative to an element or the window.
 * @author Saasflare™
 * @module packages/ui/hooks/use-mouse-position
 * @package ui
 *
 * @example
 * // Global mouse position
 * const { x, y } = useMousePosition();
 *
 * // Relative to an element
 * const ref = useRef<HTMLDivElement>(null);
 * const { x, y } = useMousePosition({ ref });
 */

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** Mouse position coordinates */
export interface MousePosition {
  /** X coordinate in pixels (relative to element or viewport) */
  x: number;
  /** Y coordinate in pixels (relative to element or viewport) */
  y: number;
}

/** Options for useMousePosition */
export interface UseMousePositionOptions {
  /** Element ref to track position relative to. Defaults to window (viewport coords). */
  ref?: RefObject<HTMLElement | null>;
  /** Whether tracking is active. Default: `true` */
  enabled?: boolean;
  /** Use requestAnimationFrame for updates. Default: `true` */
  useRAF?: boolean;
}

/**
 * Tracks the mouse position, optionally relative to a referenced element.
 * When a ref is provided, coordinates are relative to the element's top-left corner.
 * Without a ref, coordinates are relative to the viewport.
 *
 * @param {UseMousePositionOptions} [options] - Configuration options
 * @returns {MousePosition} Current x, y coordinates
 *
 * @example
 * const cardRef = useRef<HTMLDivElement>(null);
 * const { x, y } = useMousePosition({ ref: cardRef });
 * // x, y are relative to card's top-left
 */
export function useMousePosition(options: UseMousePositionOptions = {}): MousePosition {
  const { ref, enabled = true, useRAF = true } = options;
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const perform = () => {
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          setPosition({ x: clientX - rect.left, y: clientY - rect.top });
        } else {
          setPosition({ x: clientX, y: clientY });
        }
      };

      if (useRAF) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(perform);
      } else {
        perform();
      }
    },
    [ref, useRAF],
  );

  useEffect(() => {
    if (!enabled) return;

    const target = ref?.current ?? window;

    const handler = (event: Event) => {
      const e = event as MouseEvent;
      updatePosition(e.clientX, e.clientY);
    };

    target.addEventListener('mousemove', handler, { passive: true });

    return () => {
      target.removeEventListener('mousemove', handler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ref, enabled, updatePosition]);

  return position;
}
