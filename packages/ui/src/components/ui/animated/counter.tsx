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
import { useSpring, useInView, useMotionValue } from "motion/react"
import { cn } from "../../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../../providers"
import { useSaasflareMotion } from "../motion-config"

/** Props for the AnimatedCounter component. */
export interface AnimatedCounterProps
  extends Omit<React.ComponentProps<"span">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
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
 * - Shows the final value immediately when motion is disabled (reduced motion or `animated={false}`)
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
  animated,
  ...props
}: AnimatedCounterProps) {
  const sf = useSaasflareProps({ animated })
  const motion = useSaasflareMotion(sf.animated)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    visualDuration: duration,
    bounce: 0.1,
  })
  const [displayValue, setDisplayValue] = useState("0")

  useEffect(() => {
    if (motion.disabled) {
      setDisplayValue(formatNumber(value, decimals, formatted))
      return
    }
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, value, motionValue, motion.disabled, decimals, formatted])

  useEffect(() => {
    if (motion.disabled) return
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(formatNumber(latest, decimals, formatted))
    })
    return unsubscribe
  }, [springValue, decimals, formatted, motion.disabled])

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      data-slot="animated-counter"
      data-animated={String(sf.animated)}
      {...props}
    >
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
