"use client"

/**
 * @fileoverview Animated glowing border beam that orbits a container.
 * @author Saasflare™
 * A rotating gradient beam that travels along the border of its parent,
 * creating a premium glowing effect. Pure CSS animation.
 * @module packages/ui/components/ui/border-beam
 * @package ui
 *
 * @component
 * @example
 * import { BorderBeam } from '@saasflare/ui';
 * <div className="relative rounded-xl border p-6">
 *   <BorderBeam />
 *   <h3>Premium Feature</h3>
 * </div>
 *
 * @example
 * // Custom color and speed
 * <div className="relative overflow-hidden rounded-xl border p-6">
 *   <BorderBeam color="hsl(var(--chart-1))" duration={8} size={200} />
 *   <p>Content here</p>
 * </div>
 */

import { cn } from "../../lib"
import { useReducedMotion } from "./motion-config"

/** Props for the BorderBeam component. */
export interface BorderBeamProps {
  /** Beam color. Default: `"hsl(var(--primary))"` */
  color?: string
  /** Tail fade color. Default: `"transparent"` */
  colorFrom?: string
  /** Animation cycle duration in seconds. Default: `6` */
  duration?: number
  /** Beam length in pixels. Default: `150` */
  size?: number
  /** Border radius to follow (CSS value). Default: `"inherit"` */
  borderRadius?: string
  /** Additional class names. */
  className?: string
}

/**
 * Glowing beam that orbits the border of its parent container.
 *
 * - Place inside a `position: relative; overflow: hidden` parent
 * - CSS-only animation (no JS animation loop)
 * - Renders nothing when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function BorderBeam({
  color = "hsl(var(--primary))",
  colorFrom = "transparent",
  duration = 6,
  size = 150,
  borderRadius = "inherit",
  className,
}: BorderBeamProps) {
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <>
      <style>{`
        @keyframes sf-border-beam {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
      `}</style>
      <div
        className={cn("pointer-events-none absolute inset-0", className)}
        style={{ borderRadius }}
        aria-hidden="true"
        data-slot="border-beam"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius,
            /* The beam travels along the rect path */
            offsetPath: `rect(0 auto auto 0 round ${borderRadius})`,
            animation: `sf-border-beam ${duration}s linear infinite`,
            background: `linear-gradient(to left, ${color}, ${colorFrom})`,
            width: size,
            height: size,
            opacity: 0.7,
            filter: "blur(4px)",
          }}
        />
      </div>
    </>
  )
}
