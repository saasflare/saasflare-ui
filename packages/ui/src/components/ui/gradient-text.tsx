// @draft
"use client"

/**
 * @fileoverview Animated gradient text component.
 * @author Saasflare™
 * Applies an animated linear gradient to text via background-clip.
 * Supports static and animated modes with configurable colors and speed.
 * @module packages/ui/components/ui/gradient-text
 * @package ui
 *
 * @component
 * @example
 * import { GradientText } from '@saasflare/ui';
 * <h1>
 *   Build with <GradientText>Saasflare</GradientText>
 * </h1>
 *
 * @example
 * // Custom gradient and animation
 * <GradientText
 *   colors={["#ff6b6b", "#ffd93d", "#6bcb77"]}
 *   animate
 *   speed={4}
 * >
 *   Premium Feature
 * </GradientText>
 */

import { type ReactNode } from "react"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "./motion-config"

/** Props for the GradientText component. */
export interface GradientTextProps {
  /** Text content to apply the gradient to. */
  children: ReactNode
  /** Gradient color stops. Default: primary → chart-1 → chart-2 tokens */
  colors?: string[]
  /** Whether to animate the gradient position. Default: `true` */
  animate?: boolean
  /** Animation cycle duration in seconds. Default: `6` */
  speed?: number
  /** Gradient direction in degrees. Default: `90` */
  angle?: number
  /** Additional class names. */
  className?: string
}

/**
 * Text with a vibrant gradient fill, optionally animated.
 *
 * - Uses `background-clip: text` for the gradient effect
 * - Animates via CSS `@keyframes` (no JS frames)
 * - Falls back to primary color when reduced motion is preferred
 * - Renders as an inline `<span>` to nest inside any heading or paragraph
 *
 * @component
 * @package ui
 */
export function GradientText({
  children,
  colors = [
    "hsl(var(--primary))",
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
  ],
  animate = true,
  speed = 6,
  angle = 90,
  className,
}: GradientTextProps) {
  const reduced = useReducedMotion()
  const shouldAnimate = animate && !reduced

  const gradient = `linear-gradient(${angle}deg, ${colors.join(", ")}, ${colors[0]})`

  return (
    <>
      {shouldAnimate && (
        <style>{`
          @keyframes sf-gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      )}
      <span
        className={cn(
          "bg-clip-text text-transparent",
          className,
        )}
        style={{
          backgroundImage: gradient,
          backgroundSize: shouldAnimate ? "200% 200%" : "100% 100%",
          ...(shouldAnimate && {
            animation: `sf-gradient-shift ${speed}s ease infinite`,
          }),
        }}
        data-slot="gradient-text"
      >
        {children}
      </span>
    </>
  )
}
