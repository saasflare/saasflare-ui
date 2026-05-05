// @reviewed 2026-04-19
/**
 * @fileoverview Animation context — exposes the resolved `animated` flag.
 * @module packages/ui/providers/animation-context
 * @package ui
 *
 * The actual motion kill-switch is implemented in CSS (motion.css) via the
 * `[data-animated="false"]` attribute set by SaasflareProvider on <html>.
 * This context exists purely so JS code (Framer Motion, conditional
 * animations) can read the same flag without querying the DOM.
 */
"use client"

import { createContext, useContext } from "react"
import { useReducedMotion } from "../hooks/use-reduced-motion"

/** Context value exposed by {@link useAnimation}. */
interface AnimationContextType {
    /** Whether animations are enabled (composed with OS preference). */
    animated: boolean
}

/** @internal Carries the resolved `animated` flag from SaasflareProvider. */
export const AnimationContext = createContext<AnimationContextType | undefined>(
    undefined,
)

/**
 * Access the resolved animation state.
 *
 * Inside a `SaasflareProvider`, returns the provider's composed value
 * (`animated` prop AND NOT `prefers-reduced-motion`). Outside any provider,
 * falls back to the OS preference alone.
 *
 * @example
 *   const { animated } = useAnimation()
 *   <motion.div whileHover={animated ? { scale: 1.02 } : undefined} />
 */
export function useAnimation(): AnimationContextType {
    const context = useContext(AnimationContext)
    const prefersReduced = useReducedMotion()

    if (context) return context
    return { animated: !prefersReduced }
}
