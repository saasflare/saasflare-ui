"use client"

/**
 * @fileoverview Section wrapper that applies scroll-based parallax to children.
 * @author Saasflare™
 * Children move at a different rate than the page scroll, creating depth.
 * @module packages/ui/components/ui/parallax-section
 * @package ui
 *
 * @component
 * @example
 * import { ParallaxSection } from '@saasflare/ui';
 * <ParallaxSection speed={0.5}>
 *   <img src="/background.jpg" alt="Background" className="w-full" />
 * </ParallaxSection>
 */

import { useRef, type ReactNode } from "react"
import { m, useScroll, useTransform } from "motion/react"
import { cn } from "../../lib"
import { useReducedMotion } from "../../hooks/use-reduced-motion"

/** Props for the ParallaxSection component. */
export interface ParallaxSectionProps {
  /** Content to apply parallax to. */
  children: ReactNode
  /** Parallax speed factor. 0 = fixed, 0.5 = half speed, 1 = no parallax. Default: `0.5` */
  speed?: number
  /** Additional class names. */
  className?: string
}

/**
 * Section wrapper that applies scroll-based parallax to its children.
 *
 * - Children translate vertically based on scroll position and speed factor
 * - Falls back to static rendering when reduced motion is preferred
 * - Overflow hidden to prevent content leaking during parallax
 *
 * @component
 * @package ui
 */
export function ParallaxSection({
  children,
  speed = 0.5,
  className,
}: ParallaxSectionProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const offset = (1 - speed) * 100
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}px`, `${offset}px`])

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} data-slot="parallax-section">
      <m.div style={{ y }}>
        {children}
      </m.div>
    </div>
  )
}
