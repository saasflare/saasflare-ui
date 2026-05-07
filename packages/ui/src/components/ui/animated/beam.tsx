// @draft
"use client"

/**
 * @fileoverview Animated connection beam between two DOM elements.
 * @author Saasflare™
 * Draws an SVG path between two ref-targeted elements with a pulsing
 * gradient animation. Perfect for architecture/integration diagrams.
 * @module packages/ui/components/ui/animated/beam
 * @package ui
 *
 * @component
 * @example
 * import { AnimatedBeam } from '@saasflare/ui';
 * const containerRef = useRef(null);
 * const fromRef = useRef(null);
 * const toRef = useRef(null);
 *
 * <div ref={containerRef} className="relative">
 *   <div ref={fromRef}>Source</div>
 *   <div ref={toRef}>Target</div>
 *   <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
 * </div>
 */

import { useEffect, useState, useCallback, type RefObject } from "react"
import { cn } from "../../../lib"
import { useReducedMotion } from "../motion-config"

/** Props for the AnimatedBeam component. */
export interface AnimatedBeamProps {
  /** Ref to the container element (provides coordinate space). */
  containerRef: RefObject<HTMLElement | null>
  /** Ref to the source element. */
  fromRef: RefObject<HTMLElement | null>
  /** Ref to the target element. */
  toRef: RefObject<HTMLElement | null>
  /** Beam stroke color. Default: `"hsl(var(--primary))"` */
  color?: string
  /** Beam stroke width. Default: `2` */
  strokeWidth?: number
  /** Curvature offset for the bezier curve. Default: `50` */
  curvature?: number
  /** Pulse animation duration in seconds. Default: `3` */
  duration?: number
  /** Additional class names for the SVG. */
  className?: string
}

/**
 * Animated SVG beam connecting two DOM elements.
 *
 * - Calculates path dynamically from element positions
 * - Uses a gradient dash animation for the pulse effect
 * - Recalculates on resize
 * - Renders a static line when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  color = "hsl(var(--primary))",
  strokeWidth = 2,
  curvature = 50,
  duration = 3,
  className,
}: AnimatedBeamProps) {
  const reduced = useReducedMotion()
  const [path, setPath] = useState("")
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const calculatePath = useCallback(() => {
    const container = containerRef.current
    const from = fromRef.current
    const to = toRef.current
    if (!container || !from || !to) return

    const containerRect = container.getBoundingClientRect()
    const fromRect = from.getBoundingClientRect()
    const toRect = to.getBoundingClientRect()

    const x1 = fromRect.left + fromRect.width / 2 - containerRect.left
    const y1 = fromRect.top + fromRect.height / 2 - containerRect.top
    const x2 = toRect.left + toRect.width / 2 - containerRect.left
    const y2 = toRect.top + toRect.height / 2 - containerRect.top

    const midX = (x1 + x2) / 2
    const cpY = Math.min(y1, y2) - curvature

    setPath(`M ${x1} ${y1} Q ${midX} ${cpY} ${x2} ${y2}`)
    setDimensions({ width: containerRect.width, height: containerRect.height })
  }, [containerRef, fromRef, toRef, curvature])

  useEffect(() => {
    calculatePath()
    const observer = new ResizeObserver(calculatePath)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [calculatePath, containerRef])

  if (!path) return null

  const id = `sf-beam-${Math.random().toString(36).slice(2, 8)}`

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0", className)}
      width={dimensions.width}
      height={dimensions.height}
      aria-hidden="true"
      data-slot="animated-beam"
    >
      {!reduced && (
        <style>{`
          @keyframes sf-beam-dash {
            from { stroke-dashoffset: 200; }
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      )}

      {/* Background path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.15}
      />

      {/* Animated pulse */}
      <path
        d={path}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeDasharray={reduced ? "none" : "10 190"}
        style={reduced ? {} : {
          animation: `sf-beam-dash ${duration}s linear infinite`,
        }}
      />

      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="50%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}
