"use client"

/**
 * @fileoverview Reveal-on-scroll wrapper with fade/slide entrance animations.
 * @author Saasflare™
 * Uses Intersection Observer to trigger Framer Motion animations when the
 * element enters the viewport. Supports multiple direction presets.
 * @module packages/ui/components/ui/reveal-on-scroll
 * @package ui
 *
 * @component
 * @example
 * import { RevealOnScroll } from '@saasflare/ui';
 * <RevealOnScroll>
 *   <Card>Appears when scrolled into view</Card>
 * </RevealOnScroll>
 *
 * @example
 * // Slide in from the left with delay
 * <RevealOnScroll direction="left" delay={0.2}>
 *   <p>Content slides in from left</p>
 * </RevealOnScroll>
 */

import { type ReactNode } from "react"
import { m, useInView } from "motion/react"
import { useRef } from "react"
import { cn } from "../../lib"
import { springGentle, noMotion, useReducedMotion } from "./motion-config"

/** Direction the element slides in from. */
type RevealDirection = "up" | "down" | "left" | "right" | "none"

/** Axis offsets per direction. */
const DIRECTION_OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  none: { x: 0, y: 0 },
}

/** Props for the RevealOnScroll component. */
export interface RevealOnScrollProps {
  /** Content to reveal. */
  children: ReactNode
  /** Direction the element slides in from. Default: `"up"` */
  direction?: RevealDirection
  /** Animation delay in seconds. Default: `0` */
  delay?: number
  /** Intersection Observer root margin. Default: `"-80px"` */
  rootMargin?: string
  /** Whether the animation triggers only once. Default: `true` */
  once?: boolean
  /** Additional class names. */
  className?: string
}

/**
 * Wrapper that animates children into view on scroll intersection.
 *
 * - Fades in with an optional directional slide
 * - Uses a gentle spring for natural motion
 * - Renders children statically when reduced motion is preferred
 * - Triggers once by default (configurable via `once`)
 *
 * @component
 * @package ui
 */
export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  rootMargin = "-80px",
  once = true,
  className,
}: RevealOnScrollProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: rootMargin as `${number}px` })

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const offset = DIRECTION_OFFSET[direction]

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{ ...springGentle, delay }}
      className={cn("will-change-[opacity,transform]", className)}
      data-slot="reveal-on-scroll"
    >
      {children}
    </m.div>
  )
}
