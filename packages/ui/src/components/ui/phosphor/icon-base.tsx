/**
 * @fileoverview Base SVG icon primitive for Phosphor-derived icons.
 * Provides shared sizing, color, and weight handling for every icon component
 * in this directory. The actual path data is supplied by each icon via the
 * `weights` map.
 * @module @saasflare/ui/components/ui/phosphor/icon-base
 */

import * as React from "react"
import { cn } from "../../../lib"

/** Visual weight provided by Phosphor: thin stroke (regular), heavier stroke (bold), filled glyph, or duotone (filled silhouette + stroke). */
export type IconWeight = "regular" | "bold" | "fill" | "duotone"

/**
 * Public props accepted by every Phosphor icon component.
 * Mirrors the shape of `@phosphor-icons/react` so usage is familiar.
 */
export interface PhosphorIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "weight"> {
  /** Visual weight. Defaults to "regular". */
  weight?: IconWeight
  /** Width and height. Defaults to "1em" so the icon scales with the parent's font-size or Tailwind size-* class. */
  size?: string | number
  /** Stroke / fill color. Defaults to "currentColor" so the icon inherits text color. */
  color?: string
}

/** Internal props — adds the per-icon `weights` map. */
export interface IconBaseProps extends PhosphorIconProps {
  weights: Record<IconWeight, React.ReactNode>
}

export const IconBase = React.forwardRef<SVGSVGElement, IconBaseProps>(
  function IconBase(
    {
      weight = "regular",
      size = "1em",
      color = "currentColor",
      weights,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill={color}
        className={cn("shrink-0", className)}
        {...rest}
      >
        <rect width="256" height="256" fill="none" />
        {weights[weight]}
        {children}
      </svg>
    )
  },
)
