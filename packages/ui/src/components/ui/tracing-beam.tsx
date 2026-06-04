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

import * as React from "react"
import { useRef, type ReactNode } from "react"
import { m, useScroll, useTransform } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareMotion } from "./motion-config"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the TracingBeam component. */
export interface TracingBeamProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Content alongside the beam. */
  children: ReactNode
  /** Beam color. Default: `"var(--primary)"` */
  color?: string
  /** Track (background line) color. Default: `"var(--border)"` */
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
 * - Falls back to a simple left border when motion is disabled
 *   (`animated={false}` or reduced-motion preference)
 *
 * @component
 * @package ui
 */
export function TracingBeam({
  children,
  color = "var(--primary)",
  trackColor = "var(--border)",
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: TracingBeamProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"],
  })

  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const dotY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  if (motion.disabled) {
    return (
      <div
        className={cn("border-l-2 border-primary/30 pl-8", className)}
        data-slot="tracing-beam"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative pl-10", className)}
      data-slot="tracing-beam"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      {...props}
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
