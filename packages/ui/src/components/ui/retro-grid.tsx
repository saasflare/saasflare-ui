"use client"

/**
 * @fileoverview Perspective grid background with retro/cyberpunk aesthetic.
 * @author Saasflare™
 * A CSS-only perspective grid that fades toward the horizon. Ideal for
 * hero sections and feature backgrounds.
 * @module packages/ui/components/ui/retro-grid
 * @package ui
 *
 * @component
 * @example
 * import { RetroGrid } from '@saasflare/ui';
 * <div className="relative min-h-[500px]">
 *   <RetroGrid />
 *   <div className="relative z-10">Hero content</div>
 * </div>
 *
 * @example
 * // Custom grid color and size
 * <RetroGrid gridColor="var(--primary)" gridSize={40} angle={70} />
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the RetroGrid component. */
export interface RetroGridProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Grid line color. Default: `"var(--border)"` */
  gridColor?: string
  /** Grid cell size in pixels. Default: `60` */
  gridSize?: number
  /** Perspective tilt angle in degrees. Default: `65` */
  angle?: number
  /** Grid line opacity (0–1). Default: `0.4` */
  opacity?: number
}

/**
 * Perspective grid background with vanishing-point effect.
 *
 * - CSS-only (repeating linear gradients + perspective transform)
 * - Fades to transparent at the horizon via mask-image
 * - No JS, no canvas, no animation — pure visual
 *
 * @component
 * @package ui
 */
export function RetroGrid({
  gridColor = "var(--border)",
  gridSize = 60,
  angle = 65,
  opacity = 0.4,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: RetroGridProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      {...props}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
      data-slot="retro-grid"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          opacity,
          transform: `perspective(500px) rotateX(${angle}deg)`,
          transformOrigin: "bottom center",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
        }}
      />
    </div>
  )
}
