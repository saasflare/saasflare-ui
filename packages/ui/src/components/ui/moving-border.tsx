"use client"

/**
 * @fileoverview Container with a rotating animated gradient border.
 * @author Saasflare™
 * Renders a conic-gradient border that continuously rotates around the
 * element. Can wrap buttons, cards, or any content.
 * @module packages/ui/components/ui/moving-border
 * @package ui
 *
 * @component
 * @example
 * import { MovingBorder } from '@saasflare/ui';
 * <MovingBorder>
 *   <button className="px-6 py-3 font-semibold">Get Started</button>
 * </MovingBorder>
 *
 * @example
 * // Custom colors and speed
 * <MovingBorder
 *   colors={["var(--chart-1)", "var(--chart-2)", "var(--primary)"]}
 *   duration={4}
 *   borderWidth={2}
 * >
 *   <div className="p-6">Card content</div>
 * </MovingBorder>
 */

import { type ReactNode } from "react"
import { cn } from "../../lib"
import { useReducedMotion } from "./motion-config"

/** Props for the MovingBorder component. */
export interface MovingBorderProps {
  /** Content inside the border. */
  children: ReactNode
  /** Gradient colors for the rotating border. */
  colors?: string[]
  /** Rotation cycle duration in seconds. Default: `6` */
  duration?: number
  /** Border width in pixels. Default: `1.5` */
  borderWidth?: number
  /** Border radius (CSS value). Default: `"0.75rem"` */
  borderRadius?: string
  /** Additional class names for the outer wrapper. */
  className?: string
}

/**
 * Wrapper with a continuously rotating gradient border.
 *
 * - Uses a conic-gradient that rotates via CSS animation
 * - Inner content sits on top with a solid background
 * - Renders a static border when reduced motion is preferred
 * - Works on any element (buttons, cards, containers)
 *
 * @component
 * @package ui
 */
export function MovingBorder({
  children,
  colors = ["var(--primary)", "var(--chart-1)", "var(--chart-2)"],
  duration = 6,
  borderWidth = 1.5,
  borderRadius = "0.75rem",
  className,
}: MovingBorderProps) {
  const reduced = useReducedMotion()

  const gradientStops = [...colors, colors[0]].join(", ")

  return (
    <>
      {!reduced && (
        <style>{`
          @keyframes sf-border-rotate {
            from { --sf-border-angle: 0deg; }
            to { --sf-border-angle: 360deg; }
          }
          @property --sf-border-angle {
            syntax: "<angle>";
            initial-value: 0deg;
            inherits: false;
          }
        `}</style>
      )}
      <div
        className={cn("relative", className)}
        style={{
          padding: borderWidth,
          borderRadius,
          background: reduced
            ? `linear-gradient(135deg, ${gradientStops})`
            : `conic-gradient(from var(--sf-border-angle, 0deg), ${gradientStops})`,
          ...(reduced
            ? {}
            : { animation: `sf-border-rotate ${duration}s linear infinite` }),
        }}
        data-slot="moving-border"
      >
        <div
          className="relative bg-background"
          style={{ borderRadius: `calc(${borderRadius} - ${borderWidth}px)` }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
