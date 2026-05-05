// @draft
"use client"

/**
 * @fileoverview Custom animated cursor that replaces the default pointer.
 * @author Saasflare™
 * Renders a dot + ring that smoothly follow the mouse with spring physics.
 * Automatically hides on touch devices and when reduced motion is preferred.
 * @module packages/ui/components/ui/animated/cursor
 * @package ui
 *
 * @component
 * @example
 * import { AnimatedCursor } from '@saasflare/ui';
 * // Place once in your root layout
 * <AnimatedCursor />
 *
 * @example
 * // Customized appearance
 * <AnimatedCursor dotSize={8} ringSize={36} ringColor="hsl(var(--primary))" />
 */

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useReducedMotion } from "../../../hooks/use-reduced-motion"

/** Props for the AnimatedCursor component. */
export interface AnimatedCursorProps {
  /** Diameter of the inner dot in pixels. Default: `6` */
  dotSize?: number
  /** Diameter of the outer ring in pixels. Default: `32` */
  ringSize?: number
  /** CSS color for the inner dot. Default: `"hsl(var(--primary))"` */
  dotColor?: string
  /** CSS color for the outer ring border. Default: `"hsl(var(--primary))"` */
  ringColor?: string
  /** Border width of the outer ring in pixels. Default: `1.5` */
  ringBorderWidth?: number
}

/**
 * Animated cursor overlay with a dot + ring that follow the mouse.
 *
 * - The dot tracks the cursor tightly via a stiff spring
 * - The ring follows with a softer spring for a trailing effect
 * - Scales up when hovering interactive elements (buttons, links, inputs)
 * - Hides on touch devices and when `prefers-reduced-motion` is set
 *
 * @component
 * @package ui
 */
export function AnimatedCursor({
  dotSize = 6,
  ringSize = 32,
  dotColor = "hsl(var(--primary))",
  ringColor = "hsl(var(--primary))",
  ringBorderWidth = 1.5,
}: AnimatedCursorProps) {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const dotX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const dotY = useSpring(cursorY, { stiffness: 500, damping: 28 })
  const ringX = useSpring(cursorX, { stiffness: 250, damping: 20 })
  const ringY = useSpring(cursorY, { stiffness: 250, damping: 20 })

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!visible) setVisible(true)
    },
    [cursorX, cursorY, visible],
  )

  useEffect(() => {
    // Hide on touch-only devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("mouseleave", () => setVisible(false))
    window.addEventListener("mouseenter", () => setVisible(true))

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", () => setVisible(false))
      window.removeEventListener("mouseenter", () => setVisible(true))
    }
  }, [onMouseMove])

  // Track hover on interactive elements
  useEffect(() => {
    if (typeof window === "undefined") return

    const INTERACTIVE = "a, button, input, textarea, select, [role='button'], [data-cursor='pointer']"

    const onOver = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) setHovering(true)
    }
    const onOut = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) setHovering(false)
    }

    document.addEventListener("mouseover", onOver, { passive: true })
    document.addEventListener("mouseout", onOut, { passive: true })
    return () => {
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
    }
  }, [])

  if (reduced) return null

  const hoverScale = hovering ? 1.6 : 1

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* Inner dot */}
      <motion.div
        aria-hidden="true"
        style={{
          x: dotX,
          y: dotY,
          width: dotSize,
          height: dotSize,
          backgroundColor: dotColor,
          position: "fixed",
          top: -dotSize / 2,
          left: -dotSize / 2,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          scale: hoverScale,
        }}
      />

      {/* Outer ring */}
      <motion.div
        aria-hidden="true"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          border: `${ringBorderWidth}px solid ${ringColor}`,
          position: "fixed",
          top: -ringSize / 2,
          left: -ringSize / 2,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: visible ? 0.5 : 0,
          scale: hoverScale,
        }}
      />
    </>
  )
}
