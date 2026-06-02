"use client"

/**
 * @fileoverview StatefulButton — Button + loading state.
 * @module packages/ui/components/composed/stateful-button
 * @package ui
 *
 * Thin wrapper around {@link Button} that adds a single async-friendly axis:
 * `loading`. While loading, the button is disabled, prepends a spinner, and
 * optionally swaps its label for `loadingText`.
 *
 * Keeping these concerns out of the primitive lets the base Button stay
 * purely presentational; consumers opt in to stateful behavior by reaching
 * for this composed variant.
 *
 * @example
 * import { StatefulButton } from "@saasflare/ui";
 *
 * <StatefulButton loading={isPending} loadingText="Saving…">
 *   Save changes
 * </StatefulButton>
 *
 * @example // Inherits all base Button props
 * <StatefulButton variant="outline" intent="danger" loading={isDeleting}>
 *   Delete account
 * </StatefulButton>
 */

import * as React from "react"
import { Button, type ButtonProps } from "../ui/button"

/**
 * Props for {@link StatefulButton}. Extends {@link ButtonProps} with two
 * orthogonal stateful concerns. `asChild` is intentionally excluded — a
 * Slot-rendered button cannot own its own DOM children, so the spinner /
 * loading-text swap would be ambiguous. `isLoading` / `spinnerPlacement` are
 * also excluded: `loading` is StatefulButton's single async-text flag and it
 * delegates to the base Button's presentational `isLoading` internally, so
 * exposing both would create two competing loading switches.
 */
interface StatefulButtonProps
    extends Omit<ButtonProps, "asChild" | "isLoading" | "spinnerPlacement"> {
    /** Pending state: forces disabled, shows spinner, swaps label when `loadingText` is set. */
    loading?: boolean
    /** Optional label to show in place of children while `loading` is true. */
    loadingText?: React.ReactNode
}

/**
 * Button with built-in loading state.
 *
 * `loading` is the single source of truth for pending UI. It delegates to the
 * base {@link Button}'s presentational `isLoading` flag (DRY — the spinner,
 * disabled, `aria-busy`, and motion-gate logic live in one place):
 *   - sets `disabled` (Button OR-s `disabled || isLoading` internally)
 *   - sets `aria-busy="true"` for assistive tech
 *   - prepends an animated spinner before the label
 *   - replaces `children` with `loadingText` if provided (otherwise label stays)
 *
 * @component
 * @layer composed
 *
 * @param {boolean} loading - Pending state.
 * @param {React.ReactNode} loadingText - Optional override label while loading.
 * @param disabled - Native disabled flag; OR-ed with `loading`.
 * @param children - Default label, shown unless replaced by `loadingText` while loading.
 * @param rest - Remaining {@link ButtonProps} (variant, intent, surface, radius, animated, iconWeight, …) forwarded to the underlying Button.
 */
function StatefulButton({
    loading = false,
    loadingText,
    disabled,
    children,
    ...rest
}: StatefulButtonProps) {
    const label = loading && loadingText !== undefined ? loadingText : children

    return (
        <Button
            {...rest}
            isLoading={loading}
            disabled={disabled}
        >
            {label}
        </Button>
    )
}

export { StatefulButton, type StatefulButtonProps }
