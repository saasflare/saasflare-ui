"use client"

/**
 * @fileoverview Floating particle animation background.
 * @author Saasflare™
 * Renders floating circles that drift with subtle parallax motion.
 * Pure CSS animation — no canvas, no requestAnimationFrame, minimal CPU.
 * @module packages/ui/components/ui/particles-background
 * @package ui
 *
 * @component
 * @example
 * import { ParticlesBackground } from '@saasflare/ui';
 * <div className="relative min-h-screen">
 *   <ParticlesBackground />
 *   <div className="relative z-10">Your content</div>
 * </div>
 *
 * @example
 * // Custom density and color
 * <ParticlesBackground count={30} color="var(--chart-2)" maxSize={6} />
 */

import { useMemo } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useReducedMotion } from "./motion-config"

/** Props for the ParticlesBackground component. */
export interface ParticlesBackgroundProps extends SaasflareComponentProps {
  /** Number of particles. Default: `20` */
  count?: number
  /** CSS color of particles. Default: `"var(--primary)"` */
  color?: string
  /** Maximum particle diameter in pixels. Default: `4` */
  maxSize?: number
  /** Minimum particle diameter in pixels. Default: `1` */
  minSize?: number
  /** Maximum particle opacity (0–1). Default: `0.3` */
  maxOpacity?: number
  /** Animation speed multiplier. Default: `1` */
  speed?: number
  /** Additional class names for the container. */
  className?: string
}

/** Deterministic pseudo-random from seed (good enough for visual positions). */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/**
 * Ambient floating particles background.
 *
 * - CSS-only animation (no JS animation loop, GPU-composited)
 * - Deterministic positions (no layout shift between renders)
 * - Renders nothing when reduced motion is preferred or `animated` is disabled
 * - Lightweight: no canvas, no WebGL
 *
 * @component
 * @package ui
 */
export function ParticlesBackground({
  count = 20,
  color = "var(--primary)",
  maxSize = 4,
  minSize = 1,
  maxOpacity = 0.3,
  speed = 1,
  className,
  surface,
  radius,
  animated,
  iconWeight,
}: ParticlesBackgroundProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const reduced = useReducedMotion()

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (seed: number) => seededRandom(i * 100 + seed)
        const size = minSize + r(1) * (maxSize - minSize)
        const duration = (15 + r(2) * 25) / speed
        const delay = r(3) * -duration

        return {
          id: i,
          size,
          x: r(4) * 100,
          y: r(5) * 100,
          opacity: 0.05 + r(6) * maxOpacity,
          duration,
          delay,
          driftX: (r(7) - 0.5) * 40,
          driftY: -20 - r(8) * 40,
        }
      }),
    [count, minSize, maxSize, maxOpacity, speed],
  )

  if (reduced || !sf.animated) return null

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
      data-slot="particles-background"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      <style>{`
        @keyframes sf-particle-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(var(--drift-x), var(--drift-y)); }
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            borderRadius: "50%",
            opacity: p.opacity,
            ["--drift-x" as string]: `${p.driftX}px`,
            ["--drift-y" as string]: `${p.driftY}px`,
            animation: `sf-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
