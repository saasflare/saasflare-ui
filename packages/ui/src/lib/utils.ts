// @reviewed 2026-04-17
/**
 * @fileoverview Core utility functions for the Saasflare design system.
 * @module @saasflare/ui/lib/utils
 *
 * @example
 * import { cn, composeEventHandlers } from '@saasflare/ui';
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

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

// ─── Context ─────────────────────────────────────────────────────────────────

/**
 * Creates a type-safe React context with a required provider.
 * Throws a descriptive error when used outside its provider,
 * eliminating null-checks in compound components.
 *
 * @param componentName - Display name for error messages
 * @returns Tuple of [Provider, useContext hook]
 *
 * @example
 * const [TabsProvider, useTabsContext] = createSafeContext<TabsState>('Tabs');
 *
 * // In parent:
 * <TabsProvider value={{ activeTab, setActiveTab }}>...</TabsProvider>
 *
 * // In child (no null check needed):
 * const { activeTab } = useTabsContext();
 */
export function createSafeContext<T>(componentName: string) {
    const Context = React.createContext<T | undefined>(undefined);
    Context.displayName = componentName;

    function useSafeContext(): T {
        const ctx = React.useContext(Context);
        if (ctx === undefined) {
            throw new Error(
                `[Saasflare] \`${componentName}\` context is missing. ` +
                `Wrap your component tree with <${componentName}Provider>.`,
            );
        }
        return ctx;
    }

    return [Context.Provider, useSafeContext] as const;
}