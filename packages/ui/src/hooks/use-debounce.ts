// @draft
"use client"

/**
 * @fileoverview Debounce hooks for values and callbacks.
 * @author Saasflare™
 * @module packages/ui/hooks/use-debounce
 * @package ui
 *
 * @example
 * // Debounce a value (e.g., search input)
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * // Debounce a callback (e.g., API call)
 * const debouncedSave = useDebouncedCallback((value: string) => save(value), 500);
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns a debounced version of the provided value.
 * The returned value only updates after the specified delay
 * has elapsed since the last change.
 *
 * @param {T} value - The value to debounce
 * @param {number} [delay=300] - Debounce delay in milliseconds
 * @returns {T} The debounced value
 *
 * @example
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 400);
 * // debouncedQuery updates 400ms after the last setQuery call
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/** Options for useDebouncedCallback */
export interface DebouncedCallbackOptions {
  /** Debounce delay in milliseconds. Default: `300` */
  delay?: number;
  /** Maximum time the callback can be delayed. Default: `undefined` (no limit) */
  maxWait?: number;
}

/** A debounced function with cancel and flush capabilities */
export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  /** Cancel any pending invocation */
  cancel: () => void;
  /** Immediately invoke the pending callback if one exists */
  flush: () => void;
  /** Whether a call is currently pending */
  isPending: () => boolean;
}

/**
 * Returns a debounced version of the provided callback.
 * Includes cancel, flush, and isPending controls.
 *
 * @param {Function} callback - The function to debounce
 * @param {number | DebouncedCallbackOptions} [options=300] - Delay in ms or options object
 * @returns {DebouncedFunction} The debounced function with controls
 *
 * @example
 * const debouncedSearch = useDebouncedCallback(
 *   (term: string) => fetchResults(term),
 *   { delay: 400, maxWait: 2000 },
 * );
 * debouncedSearch('react'); // calls fetchResults after 400ms
 * debouncedSearch.cancel(); // cancel pending call
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  options: number | DebouncedCallbackOptions = 300,
): DebouncedFunction<T> {
  const { delay, maxWait } = typeof options === 'number'
    ? { delay: options, maxWait: undefined }
    : { delay: options.delay ?? 300, maxWait: options.maxWait };

  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(maxTimerRef.current);
    };
  }, []);

  const invoke = useCallback(() => {
    if (lastArgsRef.current !== null) {
      callbackRef.current(...lastArgsRef.current);
      lastArgsRef.current = null;
    }
    clearTimeout(timerRef.current);
    clearTimeout(maxTimerRef.current);
  }, []);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(invoke, delay);

      if (maxWait !== undefined && !maxTimerRef.current) {
        maxTimerRef.current = setTimeout(invoke, maxWait);
      }
    },
    [delay, maxWait, invoke],
  ) as DebouncedFunction<T>;

  debounced.cancel = useCallback(() => {
    lastArgsRef.current = null;
    clearTimeout(timerRef.current);
    clearTimeout(maxTimerRef.current);
  }, []);

  debounced.flush = invoke;

  debounced.isPending = useCallback(() => lastArgsRef.current !== null, []);

  return debounced;
}
