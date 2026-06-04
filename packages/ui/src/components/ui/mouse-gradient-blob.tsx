"use client"

/**
 * @fileoverview Mouse-following gradient blob ambient effect.
 * @author Saasflare™
 * Renders a large blurred radial gradient that tracks the mouse position
 * with smooth spring physics. Ideal for hero sections and landing pages.
 * @module packages/ui/components/ui/mouse-gradient-blob
 * @package ui
 *
 * @component
 * @example
 * import { MouseGradientBlob } from '@saasflare/ui';
 * <div className="relative overflow-hidden">
 *   <MouseGradientBlob />
 *   <h1>Your content here</h1>
 * </div>
 *
 * @example
 * // Custom colors and size
 * <MouseGradientBlob
 *   size={600}
 *   colors={["var(--primary)", "var(--chart-2)"]}
 *   opacity={0.2}
 * />
 *
 * @example
 * // Freeze the effect via the provider kill-switch or per-instance
 * <MouseGradientBlob animated={false} />
 */

import * as React from "react"
import { useEffect, useCallback, useRef } from "react"
import { m, useMotionValue, useSpring } from "motion/react"
import { cn } from "../../lib"
import {
  useSaasflareProps,
  type SaasflareComponentProps,
} from "../../providers"
import { springGentle, useSaasflareMotion } from "./motion-config"

/** Props for the MouseGradientBlob component. */
export interface MouseGradientBlobProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Diameter of the blob in pixels. Default: `500` */
  size?: number
  /** Gradient color stops. Default: primary + chart-2 tokens */
  colors?: [string, string]
  /** Opacity of the blob (0–1). Default: `0.15` */
  opacity?: number
  /** Blur radius in pixels. Default: `80` */
  blur?: number
  /** Additional class names for the container */
  className?: string
}

/**
 * Ambient gradient blob that follows the mouse.
 *
 * - Uses spring physics for smooth, organic motion
 * - Fades out when the mouse leaves the container
 * - Renders nothing when motion is disabled (reduced-motion preference or
 *   `animated={false}` from prop/provider)
 * - Uses `pointer-events: none` so it never blocks interaction
 *
 * @component
 * @package ui
 */
export function MouseGradientBlob({
  size = 500,
  colors = ["var(--primary)", "var(--chart-2)"],
  opacity = 0.15,
  blur = 80,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...rest
}: MouseGradientBlobProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springGentle)

  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const blobX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const blobY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left - size / 2)
      mouseY.set(e.clientY - rect.top - size / 2)
    },
    [mouseX, mouseY, size],
  )

  useEffect(() => {
    // The container is `pointer-events-none`, so it never receives pointer
    // events — track the cursor on the positioned host element it overlays.
    const host = containerRef.current?.parentElement
    if (!host || motion.disabled) return

    host.addEventListener("mousemove", onMouseMove as EventListener, { passive: true })
    return () => host.removeEventListener("mousemove", onMouseMove as EventListener)
  }, [onMouseMove, motion.disabled])

  if (motion.disabled) return null

  return (
    <div
      ref={containerRef}
      data-blob-container
      data-slot="mouse-gradient-blob"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
      {...rest}
    >
      <m.div
        style={{
          x: blobX,
          y: blobY,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 50%, transparent 70%)`,
          opacity,
          filter: `blur(${blur}px)`,
          borderRadius: "50%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  )
}
