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

import * as React from "react"
import { useState, type ReactNode } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the Hotspot container. */
export interface HotspotProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
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
export function Hotspot({
  children,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: HotspotProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <div
      {...props}
      className={cn("relative", className)}
      data-slot="hotspot"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      {children}
    </div>
  )
}

/** Props for a HotspotMarker. */
export interface HotspotMarkerProps
  extends Omit<React.ComponentProps<"div">, "color" | keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Horizontal position as percentage (0–100). */
  x: number
  /** Vertical position as percentage (0–100). */
  y: number
  /** Tooltip label text. */
  label: string
  /** Detailed description shown in the tooltip. */
  description?: string
  /** Marker dot color. Default: `"var(--primary)"` */
  color?: string
  /** Additional class names. */
  className?: string
}

/**
 * Pulsing dot marker with hover/focus tooltip at an absolute position.
 *
 * The pulse ring honors the `animated` axis (Pattern B): when animations are
 * disabled the ring stops pinging. The tooltip is reachable by keyboard (focus
 * reveals it) and associated to the trigger via `aria-describedby`.
 *
 * @component
 * @package ui
 */
export function HotspotMarker({
  x,
  y,
  label,
  description,
  color = "var(--primary)",
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: HotspotMarkerProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const [active, setActive] = useState(false)
  const tooltipId = React.useId()

  return (
    <div
      {...props}
      className={cn("absolute z-10", className)}
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      data-slot="hotspot-marker"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      {/* Pulse ring — pinging gated on the animated axis */}
      <div
        className="absolute inset-0 rounded-full opacity-30 data-[animated=true]:animate-ping"
        data-animated={String(sf.animated)}
        style={{ backgroundColor: color, width: 24, height: 24, margin: -4 }}
        aria-hidden="true"
      />
      {/* Dot */}
      <button
        type="button"
        className="relative size-4 rounded-full border-2 border-background shadow-md"
        style={{ backgroundColor: color }}
        aria-label={label}
        aria-describedby={description ? tooltipId : undefined}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      />

      {/* Tooltip */}
      {active && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-2 text-sm shadow-lg"
        >
          <p className="font-semibold text-popover-foreground">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
