// @draft
"use client"

/**
 * @fileoverview IntersectionObserver hook for viewport visibility detection.
 * @author Saasflare™
 * @module packages/ui/hooks/use-intersection-observer
 * @package ui
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const entry = useIntersectionObserver(ref, { threshold: 0.5 });
 * const isVisible = entry?.isIntersecting ?? false;
 */
'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/** Options for the IntersectionObserver */
export interface UseIntersectionObserverOptions {
  /** Margin around the root. Default: `'0px'` */
  rootMargin?: string;
  /** Visibility threshold(s) between 0 and 1. Default: `0` */
  threshold?: number | number[];
  /** Root element for intersection (defaults to viewport) */
  root?: Element | null;
  /** Only trigger once then disconnect. Default: `false` */
  triggerOnce?: boolean;
  /** Whether the observer is active. Default: `true` */
  enabled?: boolean;
}

/**
 * Observes an element's intersection with the viewport or a root element.
 * Returns the latest IntersectionObserverEntry.
 *
 * @param {RefObject<Element | null>} ref - The element to observe
 * @param {UseIntersectionObserverOptions} [options] - Observer configuration
 * @returns {IntersectionObserverEntry | null} The latest intersection entry
 *
 * @example
 * const sectionRef = useRef<HTMLElement>(null);
 * const entry = useIntersectionObserver(sectionRef, {
 *   threshold: [0, 0.25, 0.5, 0.75, 1],
 *   rootMargin: '-100px',
 * });
 * const ratio = entry?.intersectionRatio ?? 0;
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: UseIntersectionObserverOptions = {},
): IntersectionObserverEntry | null {
  const {
    rootMargin = '0px',
    threshold = 0,
    root = null,
    triggerOnce = false,
    enabled = true,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([observedEntry]) => {
        setEntry(observedEntry);
        if (triggerOnce && observedEntry.isIntersecting) {
          observerRef.current?.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observerRef.current.observe(element);

    return () => observerRef.current?.disconnect();
  }, [ref, root, rootMargin, threshold, triggerOnce, enabled]);

  return entry;
}
