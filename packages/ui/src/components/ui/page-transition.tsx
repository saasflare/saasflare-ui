"use client"

/**
 * @fileoverview Page transition wrapper with Motion AnimatePresence.
 * @author Saasflare™
 * Wraps page content with enter/exit animations for route transitions.
 * Uses the pathname as the animation key in Next.js App Router.
 * @module packages/ui/components/ui/page-transition
 * @package ui
 *
 * @component
 * @example
 * import { PageTransition } from '@saasflare/ui';
 * // In your layout.tsx — the current pathname is used as the animation key.
 * export default function Layout({ children }: { children: React.ReactNode }) {
 *   return <PageTransition>{children}</PageTransition>;
 * }
 *
 * @example
 * // Custom animation variant
 * <PageTransition variant="slideUp" duration={0.4}>
 *   {children}
 * </PageTransition>
 */

import * as React from "react"
import { type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion } from "./motion-config"

/** Motion props that conflict with native DOM event handlers on the root element. */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"

/** Animation variant presets for page transitions. */
const VARIANTS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  },
  slideDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },
} as const

/** Props for the PageTransition component. */
export interface PageTransitionProps
  extends Omit<
      React.ComponentProps<"div">,
      MotionConflicts | "children" | keyof SaasflareComponentProps
    >,
    SaasflareComponentProps {
  /** Child content to animate. */
  children: ReactNode
  /** Animation preset. Default: `"fade"` */
  variant?: keyof typeof VARIANTS
  /** Transition duration in seconds. Default: `0.3` */
  duration?: number
  /**
   * Unique key for AnimatePresence to trigger re-animation on route changes.
   * Default: the current pathname (Next.js App Router).
   */
  transitionKey?: string
}

/**
 * Page transition wrapper with configurable enter/exit animations.
 *
 * - Provides `fade`, `slideUp`, `slideDown`, and `scale` presets
 * - Renders children directly (no animation) when `animated` is `false` or
 *   reduced motion is preferred
 * - Defaults the AnimatePresence key to the current pathname, so route changes
 *   trigger the exit/enter sequence with zero configuration; override via
 *   `transitionKey` when needed
 *
 * @component
 * @package ui
 */
export function PageTransition({
  children,
  variant = "fade",
  duration = 0.3,
  transitionKey,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: PageTransitionProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, { duration, ease: "easeInOut" })
  const pathname = usePathname()
  const key = transitionKey ?? pathname ?? undefined

  if (motion.disabled) {
    return (
      <div
        {...props}
        data-slot="page-transition"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={className}
      >
        {children}
      </div>
    )
  }

  const preset = VARIANTS[variant]

  return (
    <AnimatePresence mode="wait">
      <m.div
        {...props}
        key={key}
        data-slot="page-transition"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        initial={preset.initial}
        animate={preset.animate}
        exit={preset.exit}
        transition={motion.transition}
        className={cn("will-change-[opacity,transform]", className)}
      >
        {children}
      </m.div>
    </AnimatePresence>
  )
}
