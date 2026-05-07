// @reviewed 2026-04-11
"use client"

/**
 * @fileoverview Typed localStorage hook with SSR safety, same-tab + cross-tab sync.
 * @author Saasflare™
 * @module packages/ui/hooks/use-local-storage
 * @package ui
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 * setTheme('dark');
 * removeTheme(); // reverts to 'light'
 *
 * @example
 * // With options
 * const [data, setData] = useLocalStorage('data', defaults, {
 *   serializer: superjson.stringify,
 *   deserializer: superjson.parse,
 *   onError: (err) => Sentry.captureException(err),
 * });
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Same-tab sync event name prefix. Native `storage` only fires in other tabs. */
const SYNC_PREFIX = 'sf-ls:';

/** Options for useLocalStorage. */
export interface UseLocalStorageOptions<T> {
  /** Custom serializer (default: JSON.stringify). */
  serializer?: (value: T) => string;
  /** Custom deserializer (default: JSON.parse). */
  deserializer?: (raw: string) => T;
  /** Called when read/write/remove fails. Falls back to console.warn if omitted. */
  onError?: (error: unknown, operation: 'read' | 'write' | 'remove') => void;
}

/**
 * Persists state to localStorage with automatic serialization,
 * SSR safety, and same-tab + cross-tab synchronization.
 *
 * @param key - The localStorage key
 * @param initialValue - Default value when key doesn't exist
 * @param options - Optional serializer, deserializer, and error handler
 * @returns Tuple of [value, setter, remover]
 *
 * @example
 * const [lang, setLang, removeLang] = useLocalStorage('language', 'en');
 * setLang('de');                    // sets and persists
 * setLang(prev => prev + '-US');    // functional update
 * removeLang();                     // removes key, reverts to 'en'
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Refs stabilize values so object literals don't destabilize callbacks
  const initialRef = useRef(initialValue);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const serialize = useCallback(
    (value: T): string => (optionsRef.current?.serializer ?? JSON.stringify)(value),
    [],
  );

  const deserialize = useCallback(
    (raw: string): T => (optionsRef.current?.deserializer ?? JSON.parse)(raw),
    [],
  );

  const handleError = useCallback(
    (error: unknown, operation: 'read' | 'write' | 'remove') => {
      if (optionsRef.current?.onError) {
        optionsRef.current.onError(error, operation);
      } else {
        console.warn(`useLocalStorage: ${operation} failed for "${key}"`, error);
      }
    },
    [key],
  );

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialRef.current;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? deserialize(item) : initialRef.current;
    } catch (error) {
      handleError(error, 'read');
      return initialRef.current;
    }
  }, [key, deserialize, handleError]);

  // Lazy initializer — reads from localStorage on first render
  const [storedValue, setStoredValue] = useState<T>(() => readValue());

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, serialize(next));
            // Same-tab sync — notify sibling hook instances using this key
            window.dispatchEvent(new CustomEvent(`${SYNC_PREFIX}${key}`));
          }
          return next;
        });
      } catch (error) {
        handleError(error, 'write');
      }
    },
    [key, serialize, handleError],
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent(`${SYNC_PREFIX}${key}`));
      }
      setStoredValue(initialRef.current);
    } catch (error) {
      handleError(error, 'remove');
    }
  }, [key, handleError]);

  useEffect(() => {
    // Cross-tab sync via native storage event
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setStoredValue(readValue());
    };

    // Same-tab sync — sibling instances re-read from storage (consistent with cross-tab)
    const onSync = () => setStoredValue(readValue());

    const syncEvent = `${SYNC_PREFIX}${key}`;
    window.addEventListener('storage', onStorage);
    window.addEventListener(syncEvent, onSync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(syncEvent, onSync);
    };
  }, [key, readValue]);

  // Reload when key changes dynamically
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue, removeValue];
}
