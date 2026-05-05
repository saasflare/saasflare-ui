// @draft
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

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "./motion-config"

/** Props for the BlurFade component. */
export interface BlurFadeProps {
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
 * - Renders children statically when reduced motion is preferred
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
}: BlurFadeProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur}px)` }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: yOffset, filter: `blur(${blur}px)` }
      }
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn("will-change-[opacity,transform,filter]", className)}
      data-slot="blur-fade"
    >
      {children}
    </motion.div>
  )
}
