// @reviewed 2026-04-19
"use client"

/**
 * @fileoverview Base props and resolver hook for Saasflare components.
 * @module packages/ui/providers/use-saasflare-props
 * @package ui
 *
 * Every Saasflare component MUST:
 *   1. Extend SaasflareComponentProps in its props interface
 *   2. Call useSaasflareProps(props) to resolve effective values
 *
 * This ensures consistent precedence:
 *   component prop > provider context > hardcoded defaults
 *
 * @example
 * interface CardProps extends SaasflareComponentProps {
 *   title: string
 * }
 *
 * function Card({ title, ...sfProps }: CardProps) {
 *   const { surface, radius, animated } = useSaasflareProps(sfProps)
 *   // surface/radius are guaranteed to be resolved, never undefined
 * }
 */

import { useContext } from "react"
import { AnimationContext } from "./animation-context"
import { useSaasflareTheme } from "./saasflare-provider"
import type { Radius, StyleVariant } from "../types"

// ---------------------------------------------------------------------------
// Base props — every Saasflare component extends SaasflareComponentProps
// ---------------------------------------------------------------------------

/** Props that every Saasflare component accepts for theme integration. */
export interface SaasflareComponentProps {
    /** Surface style override. Omit to inherit from provider. */
    surface?: StyleVariant
    /** Radius preset override. Omit to inherit from provider. */
    radius?: Radius
    /** Animation override. Omit to inherit from provider. */
    animated?: boolean
}

// ---------------------------------------------------------------------------
// Resolved values — what the component actually uses
// ---------------------------------------------------------------------------

/** Fully resolved theme values — no optionals, no undefined. */
export interface ResolvedSaasflareProps {
    /** Active surface style. */
    surface: StyleVariant
    /** Active radius preset. */
    radius: Radius
    /** Whether animations are enabled. */
    animated: boolean
    /** Active brand palette id (null = global.css baseline). */
    palette: string | null
}

// ---------------------------------------------------------------------------
// Resolver hook
// ---------------------------------------------------------------------------

/**
 * Resolves component-level overrides against the provider context.
 *
 * Precedence: component prop > provider context > hardcoded default
 *
 * Safe without a provider — returns sensible defaults.
 */
export function useSaasflareProps(
    props: SaasflareComponentProps = {},
): ResolvedSaasflareProps {
    const ctx = useSaasflareTheme()
    const anim = useContext(AnimationContext)

    return {
        surface: props.surface ?? ctx.surface,
        radius: props.radius ?? ctx.radius,
        animated: props.animated ?? anim?.animated ?? true,
        palette: ctx.palette,
    }
}
