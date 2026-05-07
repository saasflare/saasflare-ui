// @reviewed 2026-04-17
"use client"

/**
 * @fileoverview Core hooks for the Saasflare design system.
 * @module @saasflare/ui/lib/hooks
 *
 * @example
 * import { useControllableState } from '@saasflare/ui';
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// ─── Controllable State ──────────────────────────────────────────────────────

interface UseControllableStateParams<T> {
    /** Controlled value. When defined, the component is controlled. */
    value?: T;
    /** Initial value for uncontrolled mode. */
    defaultValue: T;
    /** Called on every state change (controlled and uncontrolled). */
    onChange?: (value: T) => void;
}

/**
 * Manages the controlled / uncontrolled duality for any component prop.
 * Mirrors the pattern used by Radix, Headless UI, and React Aria.
 *
 * @example
 * // Uncontrolled — works out of the box:
 * <Accordion defaultValue="item-1" />
 *
 * // Controlled — consumer owns the state:
 * const [value, setValue] = useState('item-1');
 * <Accordion value={value} onChange={setValue} />
 *
 * // Inside the component:
 * function Accordion({ value, defaultValue = '', onChange }: Props) {
 *   const [state, setState] = useControllableState({
 *     value, defaultValue, onChange,
 *   });
 *   // `state` is always current; `setState` handles both modes.
 * }
 */
export function useControllableState<T>({
                                            value,
                                            defaultValue,
                                            onChange,
                                        }: UseControllableStateParams<T>) {
    const [internal, setInternal] = useState(defaultValue);
    const isControlled = value !== undefined;
    const state = isControlled ? value : internal;

    const setState = useCallback(
        (next: T | ((prev: T) => T)) => {
            const nextValue =
                typeof next === 'function'
                    ? (next as (prev: T) => T)(state)
                    : next;

            if (!isControlled) {
                setInternal(nextValue);
            }
            onChange?.(nextValue);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isControlled, onChange, state],
    );

    return [state, setState] as const;
}

// ─── Callback Ref ────────────────────────────────────────────────────────────

/**
 * Returns a stable callback ref that always calls the latest handler.
 * Avoids stale-closure issues in effects that depend on callback identity.
 *
 * @example
 * const handleResize = useCallbackRef((entry: ResizeObserverEntry) => {
 *   // always has fresh closure over props/state
 * });
 */
export function useCallbackRef<T extends (...args: any[]) => any>(
    callback: T | undefined,
): T {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        ((...args: any[]) => callbackRef.current?.(...args)) as T,
        [],
    );
}
