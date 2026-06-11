// @reviewed 2026-04-17
"use client"

/**
 * @fileoverview Type-safe React context factory.
 * @module @saasflare/ui/lib/context
 *
 * Lives in its own module (not utils.ts) so the pure utilities (`cn`,
 * `mergeRefs`, `composeEventHandlers`) ship without a "use client" directive
 * and stay usable inside React Server Components.
 *
 * @example
 * import { createSafeContext } from '@saasflare/ui';
 */

import React from 'react';

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
