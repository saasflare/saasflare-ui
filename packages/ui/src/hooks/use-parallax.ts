// @draft
"use client"

/**
 * @fileoverview Hook that returns scroll-offset or cursor-offset motion values.
 * @author Saasflare™
 * @module packages/ui/hooks/use-parallax
 * @package ui
 *
 * @example
 * import { useParallax } from '@saasflare/ui';
 * const { scrollY, mouseX, mouseY } = useParallax();
 * <m.div style={{ y: useTransform(scrollY, [0, 1000], [0, -200]) }}>
 *   Parallax content
 * </m.div>
 */

import { useEffect } from "react"
import { useMotionValue, type MotionValue } from "framer-motion"

/** Return value of the useParallax hook. */
export interface ParallaxValue {
  /** Normalized scroll progress (0–1) of the page. */
  scrollY: MotionValue<number>
  /** Mouse X position (0–1, normalized to viewport width). */
  mouseX: MotionValue<number>
  /** Mouse Y position (0–1, normalized to viewport height). */
  mouseY: MotionValue<number>
}

/**
 * Returns motion values for scroll position and mouse position.
 *
 * - `scrollY`: 0 at top, 1 at bottom of document
 * - `mouseX`/`mouseY`: 0–1 normalized to viewport dimensions
 * - Use with `useTransform` to derive parallax offsets
 *
 * @returns {ParallaxValue} Motion values for scroll and mouse position
 *
 * @example
 * const { scrollY } = useParallax();
 * const y = useTransform(scrollY, [0, 1], [0, -100]);
 */
export function useParallax(): ParallaxValue {
  const scrollY = useMotionValue(0)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollY.set(maxScroll > 0 ? window.scrollY / maxScroll : 0)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [scrollY, mouseX, mouseY])

  return { scrollY, mouseX, mouseY }
}
