// @reviewed 2026-04-17

/**
 * @fileoverview Core utility functions for the Saasflare design system.
 * @module @saasflare/ui/lib/utils
 *
 * Deliberately NO "use client": these are pure functions, safe in React
 * Server Components. Client-coupled helpers live in lib/context.ts and
 * lib/hooks.ts.
 *
 * @example
 * import { cn, composeEventHandlers } from '@saasflare/ui';
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type * as React from 'react';

// ─── Class Names ─────────────────────────────────────────────────────────────

/**
 * Merges class names with Tailwind CSS conflict resolution.
 * Combines clsx conditional logic with tailwind-merge deduplication.
 *
 * @param inputs - Class values (strings, objects, arrays, undefined)
 * @returns Merged and deduplicated class string
 *
 * @example
 * cn('p-4 bg-red-500', 'bg-blue-500')   // → 'p-4 bg-blue-500'
 * cn('text-sm', isLarge && 'text-lg')    // conditional classes
 * cn('mt-2', className)                  // safe forwarding
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// ─── Refs ────────────────────────────────────────────────────────────────────

/**
 * Merges multiple refs into a single callback ref.
 * Essential for components that forward a ref while also needing an internal one.
 *
 * @example
 * const Component = forwardRef<HTMLDivElement>((props, ref) => {
 *   const internalRef = useRef<HTMLDivElement>(null);
 *   return <div ref={mergeRefs(ref, internalRef)} />;
 * });
 */
export function mergeRefs<T>(
    ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
    return (node: T | null) => {
        for (const ref of refs) {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = node;
            }
        }
    };
}

// ─── Event Handlers ──────────────────────────────────────────────────────────

/**
 * Composes two event handlers, respecting `preventDefault()`.
 * The internal handler is skipped if the external one calls `preventDefault()`.
 *
 * @param external - Consumer-provided handler (runs first)
 * @param internal - Component-internal handler (skipped if default prevented)
 *
 * @example
 * <button
 *   onClick={composeEventHandlers(props.onClick, () => {
 *     setOpen((o) => !o);
 *   })}
 * />
 */
export function composeEventHandlers<E>(
    external: ((event: E) => void) | undefined,
    internal: (event: E) => void,
): (event: E) => void {
    return (event: E) => {
        external?.(event);
        if (!(event as unknown as Event).defaultPrevented) {
            internal(event);
        }
    };
}

// createSafeContext moved to lib/context.ts (client-coupled; see fileoverview).
