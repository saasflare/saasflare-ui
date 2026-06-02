// @draft
"use client"

/**
 * @fileoverview Shimmering text with a sweeping shine animation.
 * @author Saasflare™
 * Applies a moving highlight gradient across text, perfect for
 * announcement badges like "✨ Introducing v2.0".
 * @module packages/ui/components/ui/animated/shiny-text
 * @package ui
 *
 * @component
 * @example
 * import { AnimatedShinyText } from '@saasflare/ui';
 * <AnimatedShinyText>✨ Introducing v2.0</AnimatedShinyText>
 *
 * @example
 * // Inside a badge container
 * <div className="inline-flex items-center rounded-full border px-4 py-1.5">
 *   <AnimatedShinyText speed={4}>New Feature Available</AnimatedShinyText>
 * </div>
 */

import { type ReactNode } from "react"
import { cn } from "../../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../../providers"
import { useReducedMotion } from "../motion-config"

/** Props for the AnimatedShinyText component. */
export interface AnimatedShinyTextProps extends SaasflareComponentProps {
  /** Text content. */
  children: ReactNode
  /** Animation cycle duration in seconds. Default: `3` */
  speed?: number
  /** Shimmer highlight color. Prefer design tokens. Default: `"var(--primary)"` */
  shimmerColor?: string
  /** Additional class names. */
  className?: string
}

/**
 * Text with a sweeping shimmer/shine animation.
 *
 * - CSS-only gradient animation (no JS frames)
 * - Renders static text when reduced motion is preferred or `animated={false}`
 * - Use inside badge containers for announcement strips
 *
 * @component
 * @package ui
 */
export function AnimatedShinyText({
  children,
  speed = 3,
  shimmerColor = "var(--primary)",
  className,
  surface,
  radius,
  animated,
  iconWeight,
}: AnimatedShinyTextProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const reduced = useReducedMotion()
  // The sweep runs only when both the design-system `animated` axis and the
  // user's OS motion preference allow it. `animated={false}` stops the shine
  // independent of OS reduced-motion.
  const shimmer = sf.animated && !reduced

  return (
    <>
      {shimmer && (
        <style>{`
          @keyframes sf-shimmer-sweep {
            0% { background-position: -200% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
      )}
      <span
        className={cn(
          "inline-block bg-clip-text text-transparent",
          className,
        )}
        style={{
          backgroundImage: shimmer
            ? `linear-gradient(90deg, currentColor 40%, ${shimmerColor} 50%, currentColor 60%)`
            : `linear-gradient(90deg, currentColor, currentColor)`,
          backgroundSize: shimmer ? "200% 100%" : "100% 100%",
          WebkitTextFillColor: "transparent",
          ...(shimmer
            ? { animation: `sf-shimmer-sweep ${speed}s ease-in-out infinite` }
            : {}),
        }}
        data-slot="animated-shiny-text"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
      >
        {children}
      </span>
    </>
  )
}
