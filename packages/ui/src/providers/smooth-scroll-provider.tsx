// @reviewed 2026-04-17
"use client"

/**
 * @fileoverview Provider that enables smooth scrolling behavior site-wide.
 * Applies `scroll-behavior: smooth` to the `<html>` element on mount and
 * cleans up on unmount. Respects `prefers-reduced-motion` by disabling
 * smooth scrolling when the user prefers reduced motion.
 * @module packages/ui/providers/smooth-scroll-provider
 * @package ui
 */

import { useEffect, type ReactNode } from "react"
import { useReducedMotion } from "../hooks/use-reduced-motion"

/** Props for the SmoothScrollProvider component. */
export interface SmoothScrollProviderProps {
  /** Child elements to render. */
  children: ReactNode
  /** Whether smooth scrolling is enabled. Default: `true` */
  enabled?: boolean
}

/**
 * Context-free provider that toggles smooth scrolling on `<html>`.
 *
 * - Adds `scroll-behavior: smooth` to the document element
 * - Automatically disables when `prefers-reduced-motion: reduce` is set
 * - Restores the original scroll behavior on unmount
 *
 * @component
 * @package ui
 */
export function SmoothScrollProvider({
  children,
  enabled = true,
}: SmoothScrollProviderProps) {
  const reduced = useReducedMotion()
  const shouldSmooth = enabled && !reduced

  useEffect(() => {
    if (!shouldSmooth) return

    const html = document.documentElement
    const previous = html.style.scrollBehavior

    html.style.scrollBehavior = "smooth"

    return () => {
      html.style.scrollBehavior = previous
    }
  }, [shouldSmooth])

  return <>{children}</>
}
