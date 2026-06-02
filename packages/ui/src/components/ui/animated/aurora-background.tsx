// @draft
"use client"

/**
 * @fileoverview Animated aurora/northern-lights gradient background.
 * @author Saasflare™
 * Renders overlapping gradient blobs with slow drift animations,
 * creating an aurora borealis effect. Ideal for dark hero sections.
 * @module packages/ui/components/ui/animated/aurora-background
 * @package ui
 *
 * @component
 * @example
 * import { AuroraBackground } from '@saasflare/ui';
 * <div className="relative min-h-screen bg-background">
 *   <AuroraBackground />
 *   <div className="relative z-10">Hero content</div>
 * </div>
 *
 * @example
 * // Custom colors (prefer design tokens over raw literals)
 * <AuroraBackground
 *   colors={["var(--primary)", "var(--chart-3)", "var(--chart-4)"]}
 *   opacity={0.25}
 * />
 */

import { type ReactNode } from "react"
import { cn } from "../../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../../providers"
import { useReducedMotion } from "../motion-config"

/** Props for the AuroraBackground component. */
export interface AuroraBackgroundProps extends SaasflareComponentProps {
  /** Optional child content (rendered above the aurora). */
  children?: ReactNode
  /** Aurora gradient colors (3 recommended). Prefer design tokens (e.g. `var(--primary)`). */
  colors?: string[]
  /** Overall opacity (0–1). Default: `0.15` */
  opacity?: number
  /** Animation speed multiplier. Default: `1` */
  speed?: number
  /** Additional class names. */
  className?: string
}

/**
 * Animated aurora gradient background effect.
 *
 * - Three overlapping blobs with staggered drift animations
 * - Heavy blur creates soft, organic color blending
 * - CSS-only animation (no JS frames)
 * - Renders a static gradient when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function AuroraBackground({
  children,
  colors = ["var(--primary)", "var(--chart-1)", "var(--chart-2)"],
  opacity = 0.15,
  speed = 1,
  className,
  surface,
  radius,
  animated,
  iconWeight,
}: AuroraBackgroundProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const reduced = useReducedMotion()
  // Drift runs only when both the design-system `animated` axis and the user's
  // motion preference allow it. `animated={false}` stops the drift independent
  // of OS reduced-motion.
  const drift = sf.animated && !reduced

  const blobs = [
    { color: colors[0], x: "25%", y: "25%", size: "50%", delay: 0 },
    { color: colors[1] ?? colors[0], x: "60%", y: "40%", size: "45%", delay: 2 },
    { color: colors[2] ?? colors[0], x: "40%", y: "60%", size: "55%", delay: 4 },
  ]

  const baseDuration = 15 / speed

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
      data-slot="aurora-background"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      {drift && (
        <style>{`
          @keyframes sf-aurora-drift-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(5%, -8%) scale(1.1); }
            66% { transform: translate(-3%, 5%) scale(0.95); }
          }
          @keyframes sf-aurora-drift-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-6%, 4%) scale(0.9); }
            66% { transform: translate(4%, -6%) scale(1.05); }
          }
          @keyframes sf-aurora-drift-3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(3%, 6%) scale(1.08); }
            66% { transform: translate(-5%, -3%) scale(0.92); }
          }
        `}</style>
      )}

      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            opacity,
            filter: "blur(60px)",
            ...(drift
              ? {
                  animation: `sf-aurora-drift-${i + 1} ${baseDuration + i * 2}s ease-in-out ${blob.delay}s infinite`,
                }
              : {}),
          }}
        />
      ))}

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
