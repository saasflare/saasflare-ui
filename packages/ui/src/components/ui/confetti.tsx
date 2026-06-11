"use client"

/**
 * @fileoverview Confetti burst animation trigger.
 * @author Saasflare™
 * CSS-only confetti burst with randomized particle colors, sizes, and
 * trajectories. No canvas, no external dependencies.
 * @module packages/ui/components/ui/confetti
 * @package ui
 *
 * @component
 * @example
 * import { Confetti } from '@saasflare/ui';
 * const [show, setShow] = useState(false);
 * <button onClick={() => setShow(true)}>Celebrate!</button>
 * <Confetti active={show} onComplete={() => setShow(false)} />
 *
 * @example
 * // Custom colors and particle count
 * <Confetti active={active} count={60} colors={["#ff6b6b", "#ffd93d", "#6bcb77"]} />
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useReducedMotion } from "./motion-config"

/** Default particle palette — module-level so its identity is stable across renders. */
const DEFAULT_CONFETTI_COLORS: string[] = [
  "var(--primary)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

/** Props for the Confetti component. */
export interface ConfettiProps extends SaasflareComponentProps {
  /** Whether the confetti burst is active. */
  active: boolean
  /** Number of confetti particles. Default: `40` */
  count?: number
  /** Array of CSS colors for particles. */
  colors?: string[]
  /** Duration in milliseconds before auto-cleanup. Default: `3000` */
  duration?: number
  /** Callback when animation completes. */
  onComplete?: () => void
  /** Additional class names. */
  className?: string
}

/** Deterministic pseudo-random for consistent particles. */
function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/**
 * Confetti burst animation overlay.
 *
 * - CSS-only particles with randomized trajectories
 * - Fires once when `active` becomes `true`
 * - Calls `onComplete` when the animation finishes
 * - Renders nothing when the provider's `animated` axis is off or reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function Confetti({
  active,
  count = 40,
  colors = DEFAULT_CONFETTI_COLORS,
  duration = 3000,
  onComplete,
  surface,
  radius,
  animated,
  iconWeight,
  className,
}: ConfettiProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const reduced = useReducedMotion()
  // Animation is gated on both the provider's `animated` axis and the user's
  // reduced-motion preference; either one suppresses the burst entirely.
  const enabled = sf.animated && !reduced
  const [visible, setVisible] = useState(false)

  // Latest-ref: an inline `onComplete` changes identity every parent render —
  // keying the effect on it would restart the burst mid-flight.
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (!active || !enabled) return
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      onCompleteRef.current?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [active, enabled, duration])

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (s: number) => seeded(i * 100 + s)
        return {
          id: i,
          color: colors[i % colors.length],
          x: 50 + (r(1) - 0.5) * 60,
          endX: (r(2) - 0.5) * 200,
          endY: -(100 + r(3) * 300),
          size: 4 + r(4) * 6,
          rotation: r(5) * 720,
          delay: r(6) * 0.3,
          animDuration: 1.5 + r(7) * 1.5,
        }
      }),
    [count, colors],
  )

  if (!visible || !enabled) return null

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-[9999] overflow-hidden", className)}
      aria-hidden="true"
      data-slot="confetti"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      <style>{`
        @keyframes sf-confetti-burst {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--cx), var(--cy)) rotate(var(--cr));
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: 0,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? "50%" : "1px",
            ["--cx" as string]: `${p.endX}px`,
            ["--cy" as string]: `${p.endY}px`,
            ["--cr" as string]: `${p.rotation}deg`,
            animation: `sf-confetti-burst ${p.animDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
