// @draft
"use client"

/**
 * @fileoverview Confines keyboard focus inside an element while active.
 * Used by Dialog / Drawer / Sheet to ensure Tab cycling stays within the
 * overlay. Self-contained (no `focus-trap` npm dep).
 * @author Saasflare™
 * @module packages/ui/hooks/use-focus-trap
 * @package ui
 *
 * @example
 * function MyModal({ open }: { open: boolean }) {
 *   const ref = useFocusTrap<HTMLDivElement>(open);
 *   return <div ref={ref} role="dialog">…</div>;
 * }
 */

import { useCallback, useEffect, useRef } from "react"

/** CSS selector matching every natively focusable element. */
const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "[contenteditable='true']",
    "audio[controls]",
    "video[controls]",
    "details > summary:first-of-type",
].join(",")

function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1 && isVisible(el),
    )
}

function isVisible(el: HTMLElement): boolean {
    // Skip elements hidden via display:none, visibility, or zero-size containers.
    return !!(el.offsetParent || el.getClientRects().length > 0)
}

/**
 * Returns a ref to attach to a container. While `active` is `true`:
 *   - Initial focus moves to the first focusable child (or the container itself
 *     if it has `tabindex`).
 *   - Tab and Shift+Tab cycle within the container.
 *   - On deactivate, focus is restored to whatever was focused before.
 *
 * @param active - Whether the trap is engaged.
 * @returns A ref callback to attach to the container element.
 *
 * @example
 * const trapRef = useFocusTrap<HTMLDivElement>(open);
 * <div ref={trapRef}>…</div>
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
    active: boolean,
): (node: T | null) => void {
    const containerRef = useRef<T | null>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    const setRef = useCallback((node: T | null) => {
        containerRef.current = node
    }, [])

    useEffect(() => {
        if (!active) return
        const container = containerRef.current
        if (!container) return

        previousFocusRef.current = (document.activeElement as HTMLElement) ?? null

        const focusables = getFocusable(container)
        const first = focusables[0]
        if (first) first.focus()
        else if (container.tabIndex >= 0) container.focus()

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return
            const items = getFocusable(container)
            if (items.length === 0) {
                e.preventDefault()
                return
            }
            const firstItem = items[0]
            const lastItem = items[items.length - 1]
            const active = document.activeElement as HTMLElement

            if (e.shiftKey) {
                if (active === firstItem || !container.contains(active)) {
                    e.preventDefault()
                    lastItem.focus()
                }
            } else {
                if (active === lastItem || !container.contains(active)) {
                    e.preventDefault()
                    firstItem.focus()
                }
            }
        }

        container.addEventListener("keydown", handleKeyDown)
        return () => {
            container.removeEventListener("keydown", handleKeyDown)
            const previous = previousFocusRef.current
            if (previous && typeof previous.focus === "function") {
                previous.focus()
            }
        }
    }, [active])

    return setRef
}
