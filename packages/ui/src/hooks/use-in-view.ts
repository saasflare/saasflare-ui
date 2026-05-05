// @draft
/**
 * @fileoverview Simplified viewport visibility hook — returns a boolean.
 * @author Saasflare™
 * @module packages/ui/hooks/use-in-view
 * @package ui
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const inView = useInView(ref);
 * return <div ref={ref} className={inView ? 'animate-in' : 'opacity-0'} />;
 */
'use client';

import { type RefObject } from 'react';
import {
  useIntersectionObserver,
  type UseIntersectionObserverOptions,
} from './use-intersection-observer';

/**
 * Returns `true` when the referenced element is visible in the viewport.
 * Simplified wrapper around {@link useIntersectionObserver}.
 *
 * @param {RefObject<Element | null>} ref - The element to watch
 * @param {UseIntersectionObserverOptions} [options] - Observer options
 * @returns {boolean} Whether the element is currently in view
 *
 * @example
 * const heroRef = useRef<HTMLDivElement>(null);
 * const heroVisible = useInView(heroRef, { threshold: 0.5, triggerOnce: true });
 */
export function useInView(
  ref: RefObject<Element | null>,
  options?: UseIntersectionObserverOptions,
): boolean {
  const entry = useIntersectionObserver(ref, options);
  return entry?.isIntersecting ?? false;
}
