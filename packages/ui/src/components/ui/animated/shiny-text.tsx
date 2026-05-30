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
import { useReducedMotion } from "../motion-config"

/** Props for the AnimatedShinyText component. */
export interface AnimatedShinyTextProps {
  /** Text content. */
  children: ReactNode
  /** Animation cycle duration in seconds. Default: `3` */
  speed?: number
  /** Shimmer highlight color. Default: `"var(--primary)"` */
  shimmerColor?: string
  /** Additional class names. */
  className?: string
}

/**
 * Text with a sweeping shimmer/shine animation.
 *
 * - CSS-only gradient animation (no JS frames)
 * - Renders static text when reduced motion is preferred
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
}: AnimatedShinyTextProps) {
  const reduced = useReducedMotion()

  return (
    <>
      {!reduced && (
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
          backgroundImage: reduced
            ? `linear-gradient(90deg, currentColor, currentColor)`
            : `linear-gradient(90deg, currentColor 40%, ${shimmerColor} 50%, currentColor 60%)`,
          backgroundSize: reduced ? "100% 100%" : "200% 100%",
          WebkitTextFillColor: "transparent",
          ...(reduced
            ? {}
            : { animation: `sf-shimmer-sweep ${speed}s ease-in-out infinite` }),
        }}
        data-slot="animated-shiny-text"
      >
        {children}
      </span>
    </>
  )
}
