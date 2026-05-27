// @draft
"use client"

/**
 * @fileoverview Combine multiple refs (callback refs and ref objects) into a
 * single ref callback. Required whenever a component both forwards a ref AND
 * needs its own internal ref to the same DOM node.
 * @author Saasflare™
 * @module packages/ui/hooks/use-merged-ref
 * @package ui
 *
 * @example
 * const Card = forwardRef<HTMLDivElement, Props>(function Card(props, forwardedRef) {
 *   const internalRef = useRef<HTMLDivElement>(null);
 *   const ref = useMergedRef(internalRef, forwardedRef);
 *   return <div ref={ref}>…</div>;
 * });
 */

import { useCallback, type MutableRefObject, type Ref, type RefCallback } from "react"

/** Anything React accepts as a ref slot. */
export type PossibleRef<T> = Ref<T> | MutableRefObject<T | null> | null | undefined

/**
 * Merges any number of refs into a single ref callback. The callback is
 * memoized on the identity of the input refs — if you pass new ref objects
 * on every render, the callback identity will change and React will
 * detach/reattach. In practice pass stable ref objects.
 *
 * @param refs - One or more refs (object refs or callback refs).
 * @returns A stable ref callback that writes the node to every input ref.
 *
 * @example
 * const ref = useMergedRef(forwardedRef, internalRef);
 * <div ref={ref} />
 */
export function useMergedRef<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
    return useCallback(
        (node: T | null) => {
            for (const ref of refs) {
                if (!ref) continue
                if (typeof ref === "function") {
                    ref(node)
                } else {
                    ;(ref as MutableRefObject<T | null>).current = node
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        refs,
    )
}
