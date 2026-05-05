// @draft
"use client"

/**
 * @fileoverview Animated counter that counts up when scrolled into view.
 * @author Saasflare™
 * Uses Intersection Observer to trigger a spring-based number animation.
 * Ideal for stats sections, dashboards, and metric displays.
 * @module packages/ui/components/ui/animated/counter
 * @package ui
 *
 * @component
 * @example
 * import { AnimatedCounter } from '@saasflare/ui';
 * <AnimatedCounter value={1234} />
 *
 * @example
 * // With formatting and prefix/suffix
 * <AnimatedCounter value={99.9} prefix="$" suffix="M" decimals={1} />
 */

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useInView, useMotionValue } from "framer-motion"
import { cn } from "../../../lib/utils"
import { useReducedMotion } from "../motion-config"

/** Props for the AnimatedCounter component. */
export interface AnimatedCounterProps {
  /** Target number to count up to. */
  value: number
  /** Number of decimal places. Default: `0` */
  decimals?: number
  /** Duration of the animation in seconds. Default: `2` */
  duration?: number
  /** Text to show before the number (e.g. "$"). */
  prefix?: string
  /** Text to show after the number (e.g. "%", "K"). */
  suffix?: string
  /** Additional class names. */
  className?: string
  /** Whether to use locale-aware formatting (e.g. "1,234"). Default: `true` */
  formatted?: boolean
}

/**
 * Number that animates from 0 to a target value when scrolled into view.
 *
 * - Triggers once when the element enters the viewport
 * - Uses spring physics for a natural deceleration curve
 * - Shows the final value immediately when reduced motion is preferred
 * - Supports decimal precision, prefix/suffix, and locale formatting
 *
 * @component
 * @package ui
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
  formatted = true,
}: AnimatedCounterProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  })
  const [displayValue, setDisplayValue] = useState("0")

  useEffect(() => {
    if (reduced) {
      setDisplayValue(formatNumber(value, decimals, formatted))
      return
    }
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue, reduced, decimals, formatted])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(formatNumber(latest, decimals, formatted))
    })
    return unsubscribe
  }, [springValue, decimals, formatted])

  return (
    <span ref={ref} className={cn("tabular-nums", className)} data-slot="animated-counter">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

/** Formats a number with optional decimals and locale grouping. */
function formatNumber(n: number, decimals: number, useLocale: boolean): string {
  if (useLocale) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }
  return n.toFixed(decimals)
}
