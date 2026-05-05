// @draft
"use client"

/**
 * @fileoverview Button with a sweeping shimmer/shine effect.
 * @author Saasflare™
 * A CTA button with a diagonal light sweep animation that loops infinitely.
 * Builds on top of the Saasflare Button variant system.
 * @module packages/ui/components/ui/shimmer-button
 * @package ui
 *
 * @component
 * @example
 * import { ShimmerButton } from '@saasflare/ui';
 * <ShimmerButton>Get Started Free</ShimmerButton>
 *
 * @example
 * // Custom shimmer color and speed
 * <ShimmerButton shimmerColor="rgba(255,255,255,0.3)" speed={3}>
 *   Launch Your SaaS
 * </ShimmerButton>
 */

import { type ReactNode, type ComponentProps } from "react"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "./motion-config"

/** Props for the ShimmerButton component. */
export interface ShimmerButtonProps extends ComponentProps<"button"> {
  /** Button content. */
  children: ReactNode
  /** Color of the shimmer highlight. Default: `"rgba(255,255,255,0.2)"` */
  shimmerColor?: string
  /** Shimmer cycle duration in seconds. Default: `2.5` */
  speed?: number
  /** Background color. Default: `"hsl(var(--primary))"` */
  background?: string
}

/**
 * CTA button with a continuously sweeping shimmer effect.
 *
 * - Diagonal light sweep loops infinitely
 * - CSS-only animation (no JS frames)
 * - Falls back to a static button when reduced motion is preferred
 * - Inherits standard button props (onClick, disabled, etc.)
 *
 * @component
 * @package ui
 */
export function ShimmerButton({
  children,
  shimmerColor = "rgba(255,255,255,0.2)",
  speed = 2.5,
  background = "hsl(var(--primary))",
  className,
  ...props
}: ShimmerButtonProps) {
  const reduced = useReducedMotion()

  return (
    <>
      {!reduced && (
        <style>{`
          @keyframes sf-shimmer-slide {
            from { transform: translateX(-100%) rotate(-15deg); }
            to { transform: translateX(200%) rotate(-15deg); }
          }
        `}</style>
      )}
      <button
        className={cn(
          "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110",
          className,
        )}
        style={{ background }}
        data-slot="shimmer-button"
        {...props}
      >
        {/* Shimmer overlay */}
        {!reduced && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(
                -15deg,
                transparent 30%,
                ${shimmerColor} 50%,
                transparent 70%
              )`,
              backgroundSize: "200% 100%",
              animation: `sf-shimmer-slide ${speed}s ease-in-out infinite`,
            }}
            aria-hidden="true"
          />
        )}

        <span className="relative z-10">{children}</span>
      </button>
    </>
  )
}
