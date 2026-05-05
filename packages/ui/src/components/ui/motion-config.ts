// @toreview
"use client"

/**
 * @fileoverview Shared motion presets for premium UI components.
 * @module packages/core/components/ui/motion-config
 * @layer core
 *
 * Governance:
 *   CSS transitions (var(--duration-*), var(--ease-*)) → hover, focus, color changes.
 *   These tokens already zero-out via prefers-reduced-motion in motion.css.
 *
 *   Framer Motion springs → ONLY for mount/unmount, layout, drag, presence, gesture.
 *   Use `useReducedMotion()` to disable springs when the user prefers reduced motion.
 *
 * @example
 * import { spring, useReducedMotion } from "@saasflare/core";
 * const reduced = useReducedMotion();
 * <motion.div transition={reduced ? { duration: 0 } : spring} />
 */

/** Re-export reduced-motion hook for convenience */
export { useReducedMotion } from "../../hooks/use-reduced-motion"

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
