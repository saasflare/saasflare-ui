// @draft
"use client"

/**
 * @fileoverview Long press gesture detection for mouse and touch.
 * @author Saasflare™
 * @module packages/ui/hooks/use-long-press
 * @package ui
 *
 * @example
 * const handlers = useLongPress(() => openContextMenu(), { delay: 500 });
 * <div {...handlers}>Press and hold</div>
 */
'use client';

import { useCallback, useRef } from 'react';

/** Options for the long press gesture */
export interface UseLongPressOptions {
  /** Duration in ms before the press is considered "long". Default: `400` */
  delay?: number;
  /** Cancel if the pointer moves beyond this distance in px. Default: `10` */
  moveThreshold?: number;
  /** Callback on regular (short) click */
  onClick?: () => void;
}

/** Event handlers to spread onto the target element */
export interface LongPressHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchMove: (e: React.TouchEvent) => void;
}

/**
 * Returns event handlers that detect a long press gesture.
 * Spread the returned object onto the target element.
 *
 * @param {() => void} callback - Called when a long press is detected
 * @param {UseLongPressOptions} [options] - Gesture options
 * @returns {LongPressHandlers} Event handlers to spread onto the element
 *
 * @example
 * const longPress = useLongPress(
 *   () => setContextMenu(true),
 *   { delay: 600, onClick: () => navigate('/item') },
 * );
 * <Card {...longPress}>Hold for options</Card>
 */
export function useLongPress(
  callback: () => void,
  options: UseLongPressOptions = {},
): LongPressHandlers {
  const { delay = 400, moveThreshold = 10, onClick } = options;
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const startPosRef = useRef({ x: 0, y: 0 });
  const triggeredRef = useRef(false);
  const callbackRef = useRef(callback);
  const onClickRef = useRef(onClick);

  callbackRef.current = callback;
  onClickRef.current = onClick;

  const start = useCallback(
    (x: number, y: number) => {
      triggeredRef.current = false;
      startPosRef.current = { x, y };
      timerRef.current = setTimeout(() => {
        triggeredRef.current = true;
        callbackRef.current();
      }, delay);
    },
    [delay],
  );

  const cancel = useCallback((invokeClick = false) => {
    clearTimeout(timerRef.current);
    if (invokeClick && !triggeredRef.current) {
      onClickRef.current?.();
    }
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => start(e.clientX, e.clientY),
    [start],
  );

  const onMouseUp = useCallback(() => cancel(true), [cancel]);
  const onMouseLeave = useCallback(() => cancel(false), [cancel]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      start(touch.clientX, touch.clientY);
    },
    [start],
  );

  const onTouchEnd = useCallback(() => cancel(true), [cancel]);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - startPosRef.current.x;
      const dy = touch.clientY - startPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > moveThreshold) {
        cancel(false);
      }
    },
    [moveThreshold, cancel],
  );

  return { onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, onTouchMove };
}
