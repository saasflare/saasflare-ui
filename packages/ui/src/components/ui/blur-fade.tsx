"use client"

/**
 * @fileoverview Staggered blur + fade entrance animation wrapper.
 * @author Saasflare™
 * Combines a blur filter with opacity and vertical offset for a polished
 * entrance effect. Supports stagger delay for list items.
 * @module packages/ui/components/ui/blur-fade
 * @package ui
 *
 * @component
 * @example
 * import { BlurFade } from '@saasflare/ui';
 * <BlurFade>
 *   <Card>Fades in with blur</Card>
 * </BlurFade>
 *
 * @example
 * // Staggered list
 * {items.map((item, i) => (
 *   <BlurFade key={item.id} delay={i * 0.1}>
 *     <ListItem {...item} />
 *   </BlurFade>
 * ))}
 */

import * as React from "react"
import { useRef, type ReactNode } from "react"
import { m, useInView } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion } from "./motion-config"

/** Motion event overrides that conflict with React HTML events. */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"

/** Props for the BlurFade component. */
export interface BlurFadeProps
  extends Omit<React.ComponentProps<"div">, MotionConflicts | keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Content to animate. */
  children: ReactNode
  /** Animation delay in seconds (use for staggering). Default: `0` */
  delay?: number
  /** Initial blur amount in pixels. Default: `8` */
  blur?: number
  /** Vertical offset in pixels. Default: `12` */
  yOffset?: number
  /** Animation duration in seconds. Default: `0.5` */
  duration?: number
  /** Whether animation triggers only once. Default: `true` */
  once?: boolean
  /** Additional class names. */
  className?: string
}

/**
 * Entrance animation that combines blur, opacity, and vertical slide.
 *
 * - Great for staggered reveals: pass incrementing `delay` values
 * - Blur clears simultaneously with the fade for a cohesive effect
 * - Renders children statically when reduced motion is preferred or the
 *   design-system `animated` axis is disabled (prop or provider)
 * - Uses Intersection Observer to trigger on viewport entry
 *
 * @component
 * @package ui
 */
export function BlurFade({
  children,
  delay = 0,
  blur = 8,
  yOffset = 12,
  duration = 0.5,
  once = true,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: BlurFadeProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  // Only pin a compositing layer while the entrance is actually running, then
  // release it so staggered lists don't keep a will-change layer for life.
  const [isAnimating, setIsAnimating] = React.useState(false)

  if (motion.disabled) {
    return (
      <div ref={ref} className={className} data-slot="blur-fade" {...props}>
        {children}
      </div>
    )
  }

  return (
    <m.div
      {...props}
      ref={ref}
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur}px)` }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: yOffset, filter: `blur(${blur}px)` }
      }
      transition={{ duration, delay, ease: "easeOut" }}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
      className={cn(isAnimating && "will-change-[opacity,transform,filter]", className)}
      data-slot="blur-fade"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      {children}
    </m.div>
  )
}
