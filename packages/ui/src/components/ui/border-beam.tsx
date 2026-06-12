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
 *   <BorderBeam color="var(--chart-1)" duration={8} size={200} />
 *   <p>Content here</p>
 * </div>
 */

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useReducedMotion } from "./motion-config"

/** Props for the BorderBeam component. */
export interface BorderBeamProps extends SaasflareComponentProps {
  /** Beam color. Default: `"var(--primary)"` */
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
 * - CSS-only animation (no JS animation loop), gated by the `animated` axis
 * - Renders nothing when animation is disabled (provider `animated={false}`
 *   or OS `prefers-reduced-motion`), since a static beam carries no meaning
 *
 * @component
 * @package ui
 */
export function BorderBeam({
  color = "var(--primary)",
  colorFrom = "transparent",
  duration = 6,
  size = 150,
  borderRadius = "inherit",
  className,
  surface,
  radius,
  animated,
  iconWeight,
}: BorderBeamProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const reduced = useReducedMotion()

  /* `inherit` is valid for the border-radius property but NOT inside
   * `rect(... round <radius>)` — an invalid offset-path is dropped wholesale
   * and the beam parks as a blurred blob at the container's top-left corner.
   * Fall back to the design-system radius token for the path. */
  const pathRadius = borderRadius === "inherit" ? "var(--radius, 0.625rem)" : borderRadius

  // A static border beam is meaningless decoration: skip rendering entirely
  // when the design-system `animated` axis is off or the OS prefers reduced
  // motion. motion.css would zero the keyframe via [data-animated="false"],
  // but a frozen beam stuck mid-orbit looks broken — so we omit it outright.
  if (reduced || !sf.animated) return null

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
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius,
            /* The beam travels along the rect path */
            offsetPath: `rect(0 auto auto 0 round ${pathRadius})`,
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
