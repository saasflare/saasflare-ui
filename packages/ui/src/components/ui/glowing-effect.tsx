"use client"

/**
 * @fileoverview Cursor-following glowing border effect.
 * @author Saasflare™
 * Renders a glowing border highlight that follows the mouse position
 * around the edges of its container. Trending glassmorphism accent.
 * @module packages/ui/components/ui/glowing-effect
 * @package ui
 *
 * @component
 * @example
 * import { GlowingEffect } from '@saasflare/ui';
 * <div className="relative overflow-hidden rounded-xl border p-6">
 *   <GlowingEffect />
 *   <h3>Feature Card</h3>
 * </div>
 *
 * @example
 * // Custom glow color and spread
 * <div className="relative overflow-hidden rounded-xl border p-6">
 *   <GlowingEffect color="var(--chart-1)" spread={200} blur={30} />
 *   <p>Content</p>
 * </div>
 */

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion } from "./motion-config"
import { useMousePosition } from "../../hooks/use-mouse-position"

/** Props for the GlowingEffect component. */
export interface GlowingEffectProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Glow color. Default: `"var(--primary)"` */
  color?: string
  /** Glow spread diameter in pixels. Default: `150` */
  spread?: number
  /** Blur radius in pixels. Default: `20` */
  blur?: number
  /** Glow opacity (0–1). Default: `0.4` */
  opacity?: number
  /** Border radius to match parent (CSS value). Default: `"inherit"` */
  borderRadius?: string
}

/**
 * Mouse-following glow effect for container borders.
 *
 * - Tracks mouse position and renders a radial gradient at cursor
 * - Only glows along the border (uses inset mask to hollow out center)
 * - Fades out when the mouse leaves
 * - Renders nothing when motion is disabled (reduced motion or `animated={false}`)
 *
 * @component
 * @package ui
 */
export function GlowingEffect({
  color = "var(--primary)",
  spread = 150,
  blur = 20,
  opacity = 0.4,
  borderRadius = "inherit",
  surface,
  radius,
  animated,
  iconWeight,
  className,
  style,
  ...rest
}: GlowingEffectProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated)
  // The overlay below is `pointer-events-none`, so it can never be the pointer
  // target. Track the cursor on the positioned parent the overlay covers
  // instead (captured via the ref callback during commit, before effects run).
  const parentRef = useRef<HTMLElement | null>(null)
  const pos = useMousePosition({ ref: parentRef, enabled: !motion.disabled })
  const [hovered, setHovered] = useState(false)

  const captureParent = useCallback((node: HTMLDivElement | null) => {
    parentRef.current = node?.parentElement ?? null
  }, [])

  useEffect(() => {
    const parent = parentRef.current
    if (!parent || motion.disabled) return
    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)
    parent.addEventListener("mouseenter", onEnter)
    parent.addEventListener("mouseleave", onLeave)
    return () => {
      parent.removeEventListener("mouseenter", onEnter)
      parent.removeEventListener("mouseleave", onLeave)
    }
  }, [motion.disabled])

  if (motion.disabled) return null

  return (
    <div
      ref={captureParent}
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ borderRadius, ...style }}
      aria-hidden="true"
      data-slot="glowing-effect"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      {...rest}
    >
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? opacity : 0,
          background: `radial-gradient(${spread}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 70%)`,
          filter: `blur(${blur}px)`,
          borderRadius,
          /* Mask to show glow only on borders, not fill */
          maskImage: `
            linear-gradient(black, black),
            linear-gradient(black, black)
          `,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          maskClip: "border-box, content-box",
          WebkitMaskClip: "border-box, content-box",
          padding: "2px",
        }}
      />
    </div>
  )
}
