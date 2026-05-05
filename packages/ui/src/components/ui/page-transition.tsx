// @draft
"use client"

/**
 * @fileoverview Page transition wrapper with Framer Motion AnimatePresence.
 * @author Saasflare™
 * Wraps page content with enter/exit animations for route transitions.
 * Uses the pathname as the animation key in Next.js App Router.
 * @module packages/ui/components/ui/page-transition
 * @package ui
 *
 * @component
 * @example
 * import { PageTransition } from '@saasflare/ui';
 * // In your layout.tsx
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

import { type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "../../hooks/use-reduced-motion"

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
export interface PageTransitionProps {
  /** Child content to animate. */
  children: ReactNode
  /** Animation preset. Default: `"fade"` */
  variant?: keyof typeof VARIANTS
  /** Transition duration in seconds. Default: `0.3` */
  duration?: number
  /** Unique key for AnimatePresence (use pathname). Default: none */
  transitionKey?: string
  /** Additional class names for the motion wrapper. */
  className?: string
}

/**
 * Page transition wrapper with configurable enter/exit animations.
 *
 * - Provides `fade`, `slideUp`, `slideDown`, and `scale` presets
 * - Renders children directly (no animation) when reduced motion is preferred
 * - Use `transitionKey` (typically the pathname) to trigger re-animation on route changes
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
}: PageTransitionProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const preset = VARIANTS[variant]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={preset.initial}
        animate={preset.animate}
        exit={preset.exit}
        transition={{ duration, ease: "easeInOut" }}
        className={cn("will-change-[opacity,transform]", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
