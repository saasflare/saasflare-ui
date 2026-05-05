// @draft
/**
 * @fileoverview requestAnimationFrame loop with automatic cleanup.
 * @author Saasflare™
 * @module packages/ui/hooks/use-animation-frame
 * @package ui
 *
 * @example
 * useAnimationFrame((deltaTime) => {
 *   position.current += velocity * deltaTime;
 *   render(position.current);
 * });
 */
'use client';

import { useEffect, useRef } from 'react';

/**
 * Runs a callback on every animation frame with delta time.
 * Automatically cleans up on unmount.
 *
 * @param {(deltaMs: number) => void} callback - Called each frame with time elapsed since last frame in ms
 * @param {boolean} [enabled=true] - Whether the animation loop is running
 *
 * @example
 * useAnimationFrame((delta) => {
 *   // delta is ~16ms at 60fps
 *   rotation.current += speed * delta;
 *   element.style.transform = `rotate(${rotation.current}deg)`;
 * });
 */
export function useAnimationFrame(
  callback: (deltaMs: number) => void,
  enabled = true,
): void {
  const callbackRef = useRef(callback);
  const rafRef = useRef<number | undefined>(undefined);
  const prevTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const loop = (time: number) => {
      if (prevTimeRef.current !== undefined) {
        const delta = time - prevTimeRef.current;
        callbackRef.current(delta);
      }
      prevTimeRef.current = time;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevTimeRef.current = undefined as number | undefined;
    };
  }, [enabled]);
}
