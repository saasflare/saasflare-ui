// @draft
"use client"

/**
 * @fileoverview Infinite scrolling marquee for logos, testimonials, or any content.
 * @author Saasflare™
 * CSS-only animation for performance — no JavaScript animation frames.
 * Duplicates children to create seamless infinite scroll illusion.
 * @module packages/ui/components/ui/marquee
 * @package ui
 *
 * @component
 * @example
 * import { Marquee } from '@saasflare/ui';
 * <Marquee>
 *   <img src="/logo1.svg" alt="Logo 1" />
 *   <img src="/logo2.svg" alt="Logo 2" />
 *   <img src="/logo3.svg" alt="Logo 3" />
 * </Marquee>
 *
 * @example
 * // Reverse direction, slower speed
 * <Marquee reverse speed={60} pauseOnHover>
 *   {logos.map(logo => <LogoCard key={logo.id} {...logo} />)}
 * </Marquee>
 */

import { type ReactNode } from "react"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "./motion-config"

/** Props for the Marquee component. */
export interface MarqueeProps {
  /** Items to scroll infinitely. */
  children: ReactNode
  /** Reverse scroll direction. Default: `false` */
  reverse?: boolean
  /** Scroll duration in seconds for one full cycle. Default: `40` */
  speed?: number
  /** Pause scrolling on hover. Default: `true` */
  pauseOnHover?: boolean
  /** Gap between items in pixels. Default: `48` */
  gap?: number
  /** Number of times to duplicate the content strip. Default: `2` */
  repeat?: number
  /** Enable vertical scrolling instead of horizontal. Default: `false` */
  vertical?: boolean
  /** Additional class names for the container. */
  className?: string
}

/**
 * Infinite-scrolling content ticker.
 *
 * - Pure CSS animation (no JS frames, no Framer Motion overhead)
 * - Duplicates children to create a seamless loop
 * - Pauses on hover for readability (configurable)
 * - Falls back to static flex row when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function Marquee({
  children,
  reverse = false,
  speed = 40,
  pauseOnHover = true,
  gap = 48,
  repeat = 2,
  vertical = false,
  className,
}: MarqueeProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div
        className={cn(
          "flex items-center overflow-hidden",
          vertical ? "flex-col" : "flex-row",
          className,
        )}
        style={{ gap }}
        data-slot="marquee"
      >
        {children}
      </div>
    )
  }

  const animationName = vertical ? "marquee-vertical" : "marquee-horizontal"
  const direction = reverse ? "reverse" : "normal"

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
      data-slot="marquee"
    >
      <style>{`
        @keyframes marquee-horizontal {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
      `}</style>

      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 items-center",
            vertical ? "flex-col" : "flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            gap,
            animation: `${animationName} ${speed}s linear infinite`,
            animationDirection: direction,
          }}
          aria-hidden={i > 0}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
