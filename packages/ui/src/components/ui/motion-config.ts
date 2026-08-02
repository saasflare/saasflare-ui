// @toreview
"use client"

/**
 * @fileoverview Shared motion presets for premium UI components.
 * @module packages/ui/components/ui/motion-config
 * @layer core
 *
 * Governance:
 *   CSS transitions (var(--duration-*), var(--ease-*)) → hover, focus, color changes.
 *   These tokens already zero-out via prefers-reduced-motion in motion.css.
 *
 *   Motion springs → ONLY for mount/unmount, layout, drag, presence, gesture.
 *   Use `useReducedMotion()` to disable springs when the user prefers reduced motion.
 *
 * @example
 * import { spring, useReducedMotion } from "@saasflare/ui";
 * const reduced = useReducedMotion();
 * <motion.div transition={reduced ? { duration: 0 } : spring} />
 */

import { useContext } from "react"
import type { Transition } from "motion/react"
import { useReducedMotion } from "../../hooks/use-reduced-motion"
import { AnimationContext } from "../../providers/animation-context"

/** Re-export reduced-motion hook for convenience */
export { useReducedMotion }

/** Snappy spring — default for buttons, badges, interactive feedback */
export const spring = { type: "spring", stiffness: 400, damping: 25 } as const
/** Bouncy spring — dialogs, overlays, playful entrances */
export const springBouncy = { type: "spring", stiffness: 300, damping: 15 } as const
/** Gentle spring — cards, hover lifts, subtle motion */
export const springGentle = { type: "spring", stiffness: 200, damping: 20 } as const
/** Stiff spring — toggles, switches, tight animations */
export const springStiff = { type: "spring", stiffness: 500, damping: 30 } as const
/** Instant transition — used when reduced motion is preferred */
export const noMotion = { duration: 0 } as const

/** Fade in preset (mount animation) */
export const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 } } as const
/** Scale in preset (mount animation) */
export const scaleIn = { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } } as const
/** Slide up preset (mount animation) */
export const slideUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } } as const
/** Slide down preset (mount animation) */
export const slideDown = { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 } } as const

// ---------------------------------------------------------------------------
// useSaasflareMotion — single resolver for component motion
// ---------------------------------------------------------------------------

/** Resolved motion settings for a Saasflare component. */
export interface SaasflareMotion {
    /** Spring or noMotion — drop directly onto `transition={…}`. */
    transition: Transition
    /** True when motion should be skipped — gate `whileHover`, `initial`, etc. */
    disabled: boolean
}

/**
 * Resolves the active transition for a component.
 *
 * Disables motion when **any** of these are true:
 *   - Consumer opted out (`animated={false}` from prop or `<SaasflareProvider>`)
 *   - OS reports `prefers-reduced-motion: reduce`
 *   - There is no `<SaasflareProvider>` above this component
 *   - Any `extraDisablers` (e.g. `disabled`, `loading`) is `true`
 *
 * That third condition is the one worth explaining. Animated components render
 * `m.*`, the lazy Motion primitives, which only animate inside the
 * `LazyMotion` that `SaasflareProvider` installs. Without the provider they
 * still mount — at their `initial` state, and they stay there. For an entrance
 * animation that means `opacity: 0` forever: a page that is structurally
 * perfect and completely blank, with nothing logged.
 *
 * So a missing provider counts as "motion is off". Components already branch
 * on `disabled` to render plain markup, which is visible and static — the
 * right failure for a missing provider, and a far better one than invisible.
 *
 * Single tuning point — when later we differentiate spring tokens per component
 * (`springBouncy.checkbox`, `springSnappy.dialog`), the variants live next to
 * this hook and components don't change.
 *
 * @example
 * const sf = useSaasflareProps({ surface, radius, animated })
 * const motion = useSaasflareMotion(sf.animated, springBouncy)
 *
 * // …
 * <m.span
 *   initial={motion.disabled ? false : { scale: 0 }}
 *   animate={motion.disabled ? false : { scale: 1 }}
 *   transition={motion.transition}
 * />
 *
 * @example // Button-style with extra disablers
 * const motion = useSaasflareMotion(sf.animated, spring, disabled, loading)
 */
export function useSaasflareMotion(
    animated: boolean,
    base: Transition = spring,
    ...extraDisablers: boolean[]
): SaasflareMotion {
    const reduced = useReducedMotion()
    // `undefined` means no SaasflareProvider, and therefore no LazyMotion.
    const hasProvider = useContext(AnimationContext) !== undefined
    const disabled =
        !animated || reduced || !hasProvider || extraDisablers.some(Boolean)
    return { transition: disabled ? noMotion : base, disabled }
}
