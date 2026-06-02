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
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springGentle } from "./motion-config"

/** Props for the ParallaxSection component. */
export interface ParallaxSectionProps extends SaasflareComponentProps {
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
 * - Falls back to static rendering when motion is disabled (reduced-motion or `animated={false}`)
 * - Overflow hidden to prevent content leaking during parallax
 *
 * @component
 * @package ui
 */
export function ParallaxSection({
  children,
  speed = 0.5,
  className,
  surface,
  radius,
  animated,
  iconWeight,
}: ParallaxSectionProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springGentle)
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const offset = (1 - speed) * 100
  // Hook order stays stable; when motion is disabled the transform resolves to a
  // static identity (no vertical travel) so the parallax honors the `animated` axis.
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}px`, `${offset}px`])

  if (motion.disabled) {
    return (
      <div
        className={className}
        data-slot="parallax-section"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      data-slot="parallax-section"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      <m.div style={{ y }}>
        {children}
      </m.div>
    </div>
  )
}
