"use client"

/**
 * @fileoverview Button with a sweeping shimmer/shine effect.
 * @author Saasflare™
 * A CTA button with a diagonal light sweep animation that loops infinitely.
 * Self-contained implementation that participates in the Saasflare theming
 * contract (surface / radius / animated).
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
 * <ShimmerButton shimmerColor="var(--primary-foreground)" speed={3}>
 *   Launch Your SaaS
 * </ShimmerButton>
 */

import * as React from "react"
import { type ReactNode } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useReducedMotion } from "./motion-config"

/** Props for the ShimmerButton component. */
export interface ShimmerButtonProps
  extends Omit<React.ComponentProps<"button">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Button content. */
  children: ReactNode
  /** Color of the shimmer highlight. Default: `"var(--primary-foreground)"` */
  shimmerColor?: string
  /** Shimmer cycle duration in seconds. Default: `2.5` */
  speed?: number
  /** Background color. Default: `"var(--primary)"` */
  background?: string
}

/**
 * CTA button with a continuously sweeping shimmer effect.
 *
 * - Diagonal light sweep loops infinitely
 * - CSS-only animation (no JS frames)
 * - Falls back to a static button when reduced motion is preferred or
 *   when `animated` is disabled via prop/provider
 * - Inherits standard button props (onClick, disabled, etc.)
 *
 * @component
 * @package ui
 */
export function ShimmerButton({
  children,
  shimmerColor = "var(--primary-foreground)",
  speed = 2.5,
  background = "var(--primary)",
  className,
  surface,
  radius,
  animated,
  ...props
}: ShimmerButtonProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const reduced = useReducedMotion()
  const showShimmer = sf.animated && !reduced

  return (
    <>
      {showShimmer && (
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
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        {...props}
      >
        {/* Shimmer overlay */}
        {showShimmer && (
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
