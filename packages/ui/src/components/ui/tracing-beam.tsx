"use client"

/**
 * @fileoverview Scroll-following vertical beam for long-form content.
 * @author Saasflare™
 * A vertical line that fills as the user scrolls through the content.
 * Ideal for blog posts, documentation, and changelog pages.
 * @module packages/ui/components/ui/tracing-beam
 * @package ui
 *
 * @component
 * @example
 * import { TracingBeam } from '@saasflare/ui';
 * <TracingBeam>
 *   <article>
 *     <h1>Getting Started</h1>
 *     <p>Long form content here...</p>
 *   </article>
 * </TracingBeam>
 */

import { useRef, type ReactNode } from "react"
import { m, useScroll, useTransform } from "motion/react"
import { cn } from "../../lib"
import { useReducedMotion } from "./motion-config"

/** Props for the TracingBeam component. */
export interface TracingBeamProps {
  /** Content alongside the beam. */
  children: ReactNode
  /** Beam color. Default: `"hsl(var(--primary))"` */
  color?: string
  /** Track (background line) color. Default: `"hsl(var(--border))"` */
  trackColor?: string
  /** Additional class names. */
  className?: string
}

/**
 * Vertical scroll-progress beam alongside content.
 *
 * - Fills from top to bottom as the user scrolls
 * - Renders on the left side with content offset
 * - Includes a dot indicator at the current scroll position
 * - Falls back to a simple left border when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function TracingBeam({
  children,
  color = "hsl(var(--primary))",
  trackColor = "hsl(var(--border))",
  className,
}: TracingBeamProps) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"],
  })

  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const dotY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  if (reduced) {
    return (
      <div className={cn("border-l-2 border-primary/30 pl-8", className)}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative pl-10", className)}
      data-slot="tracing-beam"
    >
      {/* Track */}
      <div
        className="absolute left-3 top-0 h-full w-px"
        style={{ backgroundColor: trackColor }}
      />

      {/* Filled beam */}
      <m.div
        className="absolute left-3 top-0 w-px"
        style={{ height: beamHeight, backgroundColor: color }}
      />

      {/* Dot indicator */}
      <m.div
        className="absolute left-[9px] size-1.5 rounded-full"
        style={{
          top: dotY,
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />

      {children}
    </div>
  )
}
