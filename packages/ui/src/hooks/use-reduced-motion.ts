// @reviewed 2026-04-17
"use client"

/**
 * @fileoverview Hook to detect user's reduced-motion preference.
 * @module packages/core/hooks/use-reduced-motion
 * @layer core
 *
 * Returns `true` when the user has enabled "Reduce motion" in their OS settings.
 * Use this to disable Framer Motion scale/translate/spring animations while
 * keeping CSS-token-driven transitions (which already zero out via motion.css).
 *
 * @example
 * const reduced = useReducedMotion();
 * <motion.div whileHover={reduced ? undefined : { scale: 1.02 }} />
 */

import * as React from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", cb)
  return () => mql.removeEventListener("change", cb)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

/**
 * Detects the user's prefers-reduced-motion media query.
 *
 * SSR-safe: returns `false` on the server, reads the real value synchronously
 * on the client during hydration, and updates when the OS preference changes.
 *
 * @returns {boolean} `true` when reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
