// @draft
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
 *   colors={["hsl(var(--primary))", "hsl(var(--chart-2))"]}
 *   opacity={0.2}
 * />
 */

import { useEffect, useCallback } from "react"
import { m, useMotionValue, useSpring } from "motion/react"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "../../hooks/use-reduced-motion"

/** Props for the MouseGradientBlob component. */
export interface MouseGradientBlobProps {
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
 * - Renders nothing when reduced motion is preferred
 * - Uses `pointer-events: none` so it never blocks interaction
 *
 * @component
 * @package ui
 */
export function MouseGradientBlob({
  size = 500,
  colors = ["hsl(var(--primary))", "hsl(var(--chart-2))"],
  opacity = 0.15,
  blur = 80,
  className,
}: MouseGradientBlobProps) {
  const reduced = useReducedMotion()

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
    const parent = document.querySelector("[data-blob-container]") as HTMLElement | null
    if (!parent || reduced) return

    parent.addEventListener("mousemove", onMouseMove as EventListener, { passive: true })
    return () => parent.removeEventListener("mousemove", onMouseMove as EventListener)
  }, [onMouseMove, reduced])

  if (reduced) return null

  return (
    <div
      data-blob-container
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
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
