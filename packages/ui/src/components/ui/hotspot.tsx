// @draft
"use client"

/**
 * @fileoverview Positioned tooltip hotspot markers on an image or container.
 * @author Saasflare™
 * Renders pulsing dot markers at absolute positions with tooltips on hover.
 * @module packages/ui/components/ui/hotspot
 * @package ui
 *
 * @component
 * @example
 * import { Hotspot, HotspotMarker } from '@saasflare/ui';
 * <Hotspot>
 *   <img src="/product.png" alt="Product" />
 *   <HotspotMarker x={30} y={45} label="Dashboard" />
 *   <HotspotMarker x={70} y={60} label="Analytics" />
 * </Hotspot>
 */

import { useState, type ReactNode } from "react"
import { cn } from "../../lib/utils"

/** Props for the Hotspot container. */
export interface HotspotProps {
  /** Background content (image, illustration, etc.) plus HotspotMarker children. */
  children: ReactNode
  /** Additional class names. */
  className?: string
}

/**
 * Container for positioned hotspot markers.
 *
 * @component
 * @package ui
 */
export function Hotspot({ children, className }: HotspotProps) {
  return (
    <div className={cn("relative", className)} data-slot="hotspot">
      {children}
    </div>
  )
}

/** Props for a HotspotMarker. */
export interface HotspotMarkerProps {
  /** Horizontal position as percentage (0–100). */
  x: number
  /** Vertical position as percentage (0–100). */
  y: number
  /** Tooltip label text. */
  label: string
  /** Detailed description shown in the tooltip. */
  description?: string
  /** Marker dot color. Default: `"hsl(var(--primary))"` */
  color?: string
  /** Additional class names. */
  className?: string
}

/**
 * Pulsing dot marker with hover tooltip at an absolute position.
 *
 * @component
 * @package ui
 */
export function HotspotMarker({
  x,
  y,
  label,
  description,
  color = "hsl(var(--primary))",
  className,
}: HotspotMarkerProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn("absolute z-10", className)}
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-slot="hotspot-marker"
    >
      {/* Pulse ring */}
      <div
        className="absolute inset-0 animate-ping rounded-full opacity-30"
        style={{ backgroundColor: color, width: 24, height: 24, margin: -4 }}
        aria-hidden="true"
      />
      {/* Dot */}
      <button
        type="button"
        className="relative size-4 rounded-full border-2 border-background shadow-md"
        style={{ backgroundColor: color }}
        aria-label={label}
      />

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-2 text-sm shadow-lg">
          <p className="font-semibold text-popover-foreground">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
