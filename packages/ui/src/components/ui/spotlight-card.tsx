"use client"

/**
 * @fileoverview Card with a mouse-following spotlight gradient highlight.
 * @author Saasflare™
 * Renders a card with a radial gradient that tracks the cursor position,
 * creating a spotlight effect. Built on top of the Saasflare Card primitive.
 * @module packages/ui/components/ui/spotlight-card
 * @package ui
 *
 * @component
 * @example
 * import { SpotlightCard } from '@saasflare/ui';
 * <SpotlightCard>
 *   <h3>Feature Title</h3>
 *   <p>Feature description text</p>
 * </SpotlightCard>
 *
 * @example
 * // Custom spotlight color
 * <SpotlightCard spotlightColor="var(--chart-1)" spotlightSize={300}>
 *   <p>Highlighted content</p>
 * </SpotlightCard>
 */

import { useEffect, useRef, useState, type ReactNode } from "react"
import { m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareMotion, spring } from "./motion-config"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Motion-reserved DOM handlers that collide with Motion's own props. */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"

/** Props for the SpotlightCard component. */
export interface SpotlightCardProps
  extends Omit<React.ComponentProps<"div">, MotionConflicts | keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Card content. */
  children: ReactNode
  /** Spotlight gradient color. Default: `"var(--primary)"` */
  spotlightColor?: string
  /** Spotlight diameter in pixels. Default: `250` */
  spotlightSize?: number
  /** Spotlight opacity (0–1). Default: `0.08` */
  spotlightOpacity?: number
  /** Additional class names. */
  className?: string
}

/**
 * Card with a radial gradient that follows the mouse cursor.
 *
 * - Gradient overlay tracks the mouse within the card boundaries
 * - Fades out when the mouse leaves
 * - Uses CSS for the gradient (no canvas, no heavy re-renders)
 * - Falls back to a plain card when motion is disabled (`animated={false}` or reduced motion)
 *
 * @component
 * @package ui
 */
export function SpotlightCard({
  children,
  spotlightColor = "var(--primary)",
  spotlightSize = 250,
  spotlightOpacity = 0.08,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SpotlightCardProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, spring)
  const cardRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  /* Hot path stays out of React: the cursor position is written as CSS
   * variables on the overlay (no per-frame re-render), and the card rect is
   * cached for the hover duration (gBCR per mousemove forces sync layout).
   * Cache invalidates on enter/scroll/resize. */
  useEffect(() => {
    const card = cardRef.current
    if (!card || motion.disabled) return
    const invalidate = () => {
      rectRef.current = null
    }
    const onMove = (e: MouseEvent) => {
      const overlay = overlayRef.current
      if (!overlay) return
      const rect = rectRef.current ?? (rectRef.current = card.getBoundingClientRect())
      overlay.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`)
      overlay.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`)
    }
    card.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", invalidate, { passive: true, capture: true })
    window.addEventListener("resize", invalidate, { passive: true })
    return () => {
      card.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", invalidate, { capture: true })
      window.removeEventListener("resize", invalidate)
    }
  }, [motion.disabled])

  return (
    <m.div
      ref={cardRef}
      {...props}
      onMouseEnter={
        motion.disabled
          ? undefined
          : () => {
              rectRef.current = null
              setIsHovered(true)
            }
      }
      onMouseLeave={motion.disabled ? undefined : () => setIsHovered(false)}
      data-slot="spotlight-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "relative overflow-hidden rounded-xl border surface-card p-6 text-card-foreground",
        "transition-all duration-200 hover:-translate-y-px hover:shadow-md",
        "motion-reduce:hover:transform-none",
        className,
      )}
    >
      {/* Spotlight gradient overlay */}
      {!motion.disabled && (
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? spotlightOpacity : 0,
            background: `radial-gradient(${spotlightSize}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </m.div>
  )
}
